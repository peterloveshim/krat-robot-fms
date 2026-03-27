-- ============================================================================
-- 크라트로보틱스 FMS 스키마 v4 — 24개 수집항목 기준 경량화
-- 생성일: 2026-03-25
-- 대상: Supabase (PostgreSQL 15+)
-- 설계원칙: (1) 구역 앵커 유지  (2) 24개 수집항목에 1:1 매핑
--           (3) IP축적+운영필수만 유지  (4) 보안로봇 확장 용이
-- 변경이력: v3(17테이블) → v4(14테이블) / 제거7 + 신규3(IP전용)
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";


-- ============================================================================
-- ENUMS
-- ============================================================================

CREATE TYPE robot_category AS ENUM ('CLEANING', 'AIR_PURIFIER', 'SECURITY');
CREATE TYPE robot_subtype AS ENUM ('WET_SCRUB', 'DRY_VACUUM', 'NAMUX', 'LYNX_M20');
CREATE TYPE robot_status AS ENUM (
    'ONLINE', 'OFFLINE', 'CHARGING', 'WORKING', 'ERROR',
    'MANUAL', 'RETURNING', 'IDLE', 'MAINTENANCE'
);

CREATE TYPE complex_grade AS ENUM ('ULTRA_PREMIUM', 'PREMIUM', 'HIGH_END', 'STANDARD');

CREATE TYPE floor_material AS ENUM (
    'MARBLE', 'GRANITE', 'POLISHED_CONCRETE', 'EPOXY',
    'PORCELAIN_TILE', 'CERAMIC_TILE', 'VINYL', 'CARPET',
    'WOOD', 'RUBBER', 'OTHER'
);

CREATE TYPE zone_type AS ENUM (
    'LOBBY', 'CORRIDOR', 'PARKING_B1', 'PARKING_B2', 'PARKING_B3',
    'ELEVATOR_HALL', 'COMMUNITY_CENTER', 'FITNESS', 'SWIMMING_POOL',
    'KIDS_ROOM', 'LIBRARY', 'OUTDOOR_DECK', 'ROOFTOP',
    'MANAGEMENT_OFFICE', 'GARBAGE_ROOM', 'MECHANICAL_ROOM', 'OTHER'
);

CREATE TYPE mission_status AS ENUM (
    'SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'FAILED',
    'CANCELLED', 'PAUSED', 'MANUAL_OVERRIDE'
);

CREATE TYPE incident_severity AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');
CREATE TYPE incident_status AS ENUM ('OPEN', 'INVESTIGATING', 'RESOLVED', 'CLOSED');

CREATE TYPE interaction_type AS ENUM (
    'RESIDENT_ENCOUNTER',   -- 입주민 마주침 (라이온스봇)
    'PET_ENCOUNTER',        -- 반려동물 마주침
    'CHILD_ENCOUNTER',      -- 어린이 마주침
    'VITAL_SIGN_REQUEST',   -- 바이탈사인 요청 (나무엑스)
    'CONVERSATION_ATTEMPT', -- 대화시도 (나무엑스)
    'EMERGENCY_CALL'        -- 긴급 호출
);


-- ============================================================================
-- 1. complexes — 단지(location)
-- ============================================================================

CREATE TABLE complexes (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name                VARCHAR(200) NOT NULL,
    address             TEXT,
    district            VARCHAR(50),
    city                VARCHAR(50) DEFAULT '서울',
    is_tower_pmc        BOOLEAN DEFAULT TRUE,
    tower_pmc_site_code VARCHAR(20),
    complex_grade       complex_grade NOT NULL DEFAULT 'HIGH_END',
    total_units         INTEGER,
    site_manager_name   VARCHAR(100),
    site_manager_phone  VARCHAR(20),
    notes               TEXT,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ============================================================================
-- 2. zones — ★ 구역 앵커 ★
-- ============================================================================

CREATE TABLE zones (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    complex_id          UUID NOT NULL REFERENCES complexes(id) ON DELETE CASCADE,
    name                VARCHAR(200) NOT NULL,
    zone_type           zone_type NOT NULL,
    floor_level         VARCHAR(10),
    area_m2             DECIMAL(8,2),
    -- 구역 프로파일 (IP)
    floor_material      floor_material NOT NULL DEFAULT 'OTHER',
    contamination_level VARCHAR(20) DEFAULT 'MEDIUM',
    contamination_type  VARCHAR(100),
    -- 운영 지침 (구역에 앵커)
    optimal_speed_mps   DECIMAL(4,2),
    optimal_water_level VARCHAR(20),
    optimal_brush_pressure VARCHAR(20),
    cleaning_passes     INTEGER DEFAULT 1,
    -- 스케줄
    quiet_hours_start   TIME,
    quiet_hours_end     TIME,
    peak_hours_start    TIME,
    peak_hours_end      TIME,
    noise_limit_db      DECIMAL(5,2),
    -- 안전
    encounter_protocol  TEXT,
    robot_accessible    BOOLEAN NOT NULL DEFAULT TRUE,
    -- Phase 2 예약 (JSONB)
    weather_override_json  JSONB,
    seasonal_profile_json  JSONB,
    priority_score         DECIMAL(5,2),
    resident_feedback_json JSONB,
    notes               TEXT,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_zones_complex ON zones(complex_id);


-- ============================================================================
-- 3. zone_maps — SLAM맵 버전관리 [라이온스봇#1, 나무엑스#1]
-- ============================================================================

CREATE TABLE zone_maps (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    zone_id             UUID NOT NULL REFERENCES zones(id) ON DELETE CASCADE,
    robot_category      robot_category NOT NULL,     -- 어떤 로봇의 맵인지
    version             INTEGER NOT NULL DEFAULT 1,
    map_file_url        VARCHAR(500),
    map_format          VARCHAR(20) DEFAULT 'PGM',
    resolution_m        DECIMAL(6,4),
    change_reason       TEXT,
    is_active           BOOLEAN NOT NULL DEFAULT TRUE,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_zone_maps_zone ON zone_maps(zone_id);
CREATE UNIQUE INDEX idx_zone_maps_active ON zone_maps(zone_id, robot_category) WHERE is_active = TRUE;


-- ============================================================================
-- 4. robots — 로봇 마스터 (멀티벤더)
-- ============================================================================

CREATE TABLE robots (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    serial_number       VARCHAR(100) NOT NULL UNIQUE,
    display_name        VARCHAR(100),
    -- 분류
    category            robot_category NOT NULL,
    subtype             robot_subtype NOT NULL,
    manufacturer        VARCHAR(100) NOT NULL,
    model               VARCHAR(100) NOT NULL,
    -- 실시간 상태 (트리거 자동갱신)
    status              robot_status NOT NULL DEFAULT 'OFFLINE',
    battery_pct         DECIMAL(5,2),
    current_zone_id     UUID REFERENCES zones(id),
    latitude            DECIMAL(10,7),
    longitude           DECIMAL(10,7),
    last_seen_at        TIMESTAMPTZ,
    -- 배치
    complex_id          UUID REFERENCES complexes(id),
    assigned_zone_ids   UUID[],
    -- 충전독 (v3의 charging_docks 테이블 흡수)
    dock_zone_id        UUID REFERENCES zones(id),
    dock_latitude       DECIMAL(10,7),
    dock_longitude      DECIMAL(10,7),
    -- 탱크 (미화전용)
    clean_water_pct     DECIMAL(5,2),
    dirty_water_pct     DECIMAL(5,2),
    -- 펌웨어
    firmware_version    VARCHAR(50),
    -- 누적
    total_missions      INTEGER DEFAULT 0,
    total_area_m2       DECIMAL(12,2) DEFAULT 0,
    total_hours         DECIMAL(10,2) DEFAULT 0,
    -- 메타
    deployed_at         TIMESTAMPTZ,
    notes               TEXT,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_robots_complex ON robots(complex_id);
CREATE INDEX idx_robots_category ON robots(category);
CREATE INDEX idx_robots_status ON robots(status);


-- ============================================================================
-- 5. telemetry — 통합 텔레메트리
--    [라이온스봇#4 오염도패턴, #6 물탱크, #10 운행상태]
--    [나무엑스#2 본체공기질, #3 분산에어센서, #10 운행상태]
-- ============================================================================

CREATE TABLE telemetry (
    id                  BIGSERIAL,
    robot_id            UUID NOT NULL,
    captured_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    -- 공통: 운행상태값 (10초)
    latitude            DECIMAL(10,7),
    longitude           DECIMAL(10,7),
    zone_id             UUID,
    speed_mps           DECIMAL(5,3),
    battery_pct         DECIMAL(5,2),
    battery_voltage     DECIMAL(6,2),
    -- 미화전용: 오염도패턴 (15초) + 물탱크소모패턴 (5분)
    floor_contamination DECIMAL(5,2),
    clean_water_pct     DECIMAL(5,2),
    dirty_water_pct     DECIMAL(5,2),
    -- 공기청정전용: 본체공기질센서 (15초)
    pm25                DECIMAL(6,2),
    co2_ppm             DECIMAL(8,2),
    tvoc_ppb            DECIMAL(8,2),
    humidity_pct        DECIMAL(5,2),
    temperature_c       DECIMAL(5,2),
    -- 공기청정전용: 분산에어센서
    sensor_node_id      VARCHAR(50),       -- NULL=본체, 값있으면 분산센서 노드ID
    -- 네트워크
    wifi_rssi_dbm       INTEGER,
    -- 확장용
    raw_json            JSONB,
    PRIMARY KEY (id, captured_at)
) PARTITION BY RANGE (captured_at);

-- 2026년 파티션
CREATE TABLE telemetry_2026_04 PARTITION OF telemetry FOR VALUES FROM ('2026-04-01') TO ('2026-05-01');
CREATE TABLE telemetry_2026_05 PARTITION OF telemetry FOR VALUES FROM ('2026-05-01') TO ('2026-06-01');
CREATE TABLE telemetry_2026_06 PARTITION OF telemetry FOR VALUES FROM ('2026-06-01') TO ('2026-07-01');
CREATE TABLE telemetry_2026_07 PARTITION OF telemetry FOR VALUES FROM ('2026-07-01') TO ('2026-08-01');
CREATE TABLE telemetry_2026_08 PARTITION OF telemetry FOR VALUES FROM ('2026-08-01') TO ('2026-09-01');
CREATE TABLE telemetry_2026_09 PARTITION OF telemetry FOR VALUES FROM ('2026-09-01') TO ('2026-10-01');
CREATE TABLE telemetry_2026_10 PARTITION OF telemetry FOR VALUES FROM ('2026-10-01') TO ('2026-11-01');
CREATE TABLE telemetry_2026_11 PARTITION OF telemetry FOR VALUES FROM ('2026-11-01') TO ('2026-12-01');
CREATE TABLE telemetry_2026_12 PARTITION OF telemetry FOR VALUES FROM ('2026-12-01') TO ('2027-01-01');

CREATE INDEX idx_telemetry_robot_time ON telemetry(robot_id, captured_at DESC);
CREATE INDEX idx_telemetry_zone ON telemetry(zone_id, captured_at DESC);


-- ============================================================================
-- 6. path_logs — 경로로그 ★IP핵심★ [라이온스봇#3, 나무엑스#6]
--    SLAM맵과 비교 → 청소 커버리지율 도출
-- ============================================================================

CREATE TABLE path_logs (
    id                  BIGSERIAL,
    robot_id            UUID NOT NULL,
    mission_id          UUID,              -- missions FK (아래 정의)
    captured_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    -- 좌표
    latitude            DECIMAL(10,7) NOT NULL,
    longitude           DECIMAL(10,7) NOT NULL,
    zone_id             UUID,
    -- 메타
    heading_deg         DECIMAL(5,2),
    speed_mps           DECIMAL(5,3),
    PRIMARY KEY (id, captured_at)
) PARTITION BY RANGE (captured_at);

-- path_logs 파티션 (telemetry와 동일 구간)
CREATE TABLE path_logs_2026_04 PARTITION OF path_logs FOR VALUES FROM ('2026-04-01') TO ('2026-05-01');
CREATE TABLE path_logs_2026_05 PARTITION OF path_logs FOR VALUES FROM ('2026-05-01') TO ('2026-06-01');
CREATE TABLE path_logs_2026_06 PARTITION OF path_logs FOR VALUES FROM ('2026-06-01') TO ('2026-07-01');
CREATE TABLE path_logs_2026_07 PARTITION OF path_logs FOR VALUES FROM ('2026-07-01') TO ('2026-08-01');
CREATE TABLE path_logs_2026_08 PARTITION OF path_logs FOR VALUES FROM ('2026-08-01') TO ('2026-09-01');
CREATE TABLE path_logs_2026_09 PARTITION OF path_logs FOR VALUES FROM ('2026-09-01') TO ('2026-10-01');
CREATE TABLE path_logs_2026_10 PARTITION OF path_logs FOR VALUES FROM ('2026-10-01') TO ('2026-11-01');
CREATE TABLE path_logs_2026_11 PARTITION OF path_logs FOR VALUES FROM ('2026-11-01') TO ('2026-12-01');
CREATE TABLE path_logs_2026_12 PARTITION OF path_logs FOR VALUES FROM ('2026-12-01') TO ('2027-01-01');

CREATE INDEX idx_path_robot_time ON path_logs(robot_id, captured_at DESC);
CREATE INDEX idx_path_mission ON path_logs(mission_id, captured_at DESC);

COMMENT ON TABLE path_logs IS '★IP핵심: 경로로그+좌표. SLAM맵 대비 커버리지율 산출, 최적 동선 도출의 원천 데이터.';


-- ============================================================================
-- 7. missions — 미션/운행스케줄
--    [라이온스봇#2 청소전후오염도, #7 운행스케줄, #9 수동오버라이드]
--    [나무엑스#4 청정전후오염도, #7 운행스케줄]
-- ============================================================================

CREATE TABLE missions (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    robot_id            UUID NOT NULL REFERENCES robots(id),
    zone_id             UUID NOT NULL REFERENCES zones(id),
    complex_id          UUID NOT NULL REFERENCES complexes(id),
    -- 스케줄 (양방향 API)
    mission_name        VARCHAR(200),
    status              mission_status NOT NULL DEFAULT 'SCHEDULED',
    scheduled_at        TIMESTAMPTZ,
    started_at          TIMESTAMPTZ,
    completed_at        TIMESTAMPTZ,
    duration_minutes    DECIMAL(8,2),
    -- 미화 결과: 청소 전후 오염도
    area_cleaned_m2     DECIMAL(10,2),
    coverage_pct        DECIMAL(5,2),
    cleaning_score      DECIMAL(5,2),
    water_used_liters   DECIMAL(8,2),
    pre_contamination   DECIMAL(5,2),
    post_contamination  DECIMAL(5,2),
    -- 공기청정 결과: 청정 전후 오염도
    pre_pm25            DECIMAL(6,2),
    post_pm25           DECIMAL(6,2),
    pre_co2             DECIMAL(8,2),
    post_co2            DECIMAL(8,2),
    delta_air_quality   DECIMAL(5,2),      -- 개선률 (%)
    -- 수동 오버라이드
    manual_override     BOOLEAN DEFAULT FALSE,
    manual_override_reason TEXT,
    -- 에러
    error_code          VARCHAR(50),
    error_message       TEXT,
    notes               TEXT,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_missions_robot ON missions(robot_id);
CREATE INDEX idx_missions_zone ON missions(zone_id);
CREATE INDEX idx_missions_status ON missions(status);
CREATE INDEX idx_missions_date ON missions(started_at DESC);


-- ============================================================================
-- 8. consumable_types — 소모품 유형 + 단가
-- ============================================================================

CREATE TABLE consumable_types (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name                VARCHAR(100) NOT NULL,
    category            VARCHAR(50),       -- BRUSH, FILTER, SQUEEGEE, PAD, HEPA
    applicable_categories robot_category[], -- 적용 가능한 로봇 카테고리
    applicable_subtypes robot_subtype[],
    unit_cost_krw       INTEGER,
    expected_lifespan_hours INTEGER,
    supplier            VARCHAR(200),
    part_number         VARCHAR(100),
    lead_time_days      INTEGER,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ============================================================================
-- 9. consumables — 소모품 추적 [라이온스봇#5, 나무엑스#5]
-- ============================================================================

CREATE TABLE consumables (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    robot_id            UUID NOT NULL REFERENCES robots(id),
    consumable_type_id  UUID NOT NULL REFERENCES consumable_types(id),
    remaining_pct       DECIMAL(5,2) NOT NULL DEFAULT 100,
    installed_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    hours_used          DECIMAL(10,2) DEFAULT 0,
    area_cleaned_m2     DECIMAL(12,2) DEFAULT 0,
    alert_threshold_pct DECIMAL(5,2) DEFAULT 20,
    is_alert_active     BOOLEAN DEFAULT FALSE,
    replaced_at         TIMESTAMPTZ,
    notes               TEXT,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_consumables_robot ON consumables(robot_id);
CREATE INDEX idx_consumables_alert ON consumables(is_alert_active) WHERE is_alert_active = TRUE;


-- ============================================================================
-- 10. interaction_events — 입주민 상호작용 통합
--     [라이온스봇#8 마주침이벤트]
--     [나무엑스#8 바이탈사인요청, #9 대화시도]
-- ============================================================================

CREATE TABLE interaction_events (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    robot_id            UUID NOT NULL REFERENCES robots(id),
    zone_id             UUID REFERENCES zones(id),
    complex_id          UUID NOT NULL REFERENCES complexes(id),
    -- 이벤트
    interaction_type    interaction_type NOT NULL,
    occurred_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    -- 행동
    robot_action        VARCHAR(50),       -- SLOW_DOWN, STOP, YIELD, RESPOND
    -- 마주침 상세 (라이온스봇)
    encounter_duration_sec INTEGER,
    -- 바이탈/대화 상세 (나무엑스)
    request_detail      TEXT,              -- 바이탈사인 요청 내용 / 대화 내용 요약
    response_status     VARCHAR(20),       -- SUCCESS, TIMEOUT, DECLINED
    -- 메타
    latitude            DECIMAL(10,7),
    longitude           DECIMAL(10,7),
    notes               TEXT,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_interaction_robot ON interaction_events(robot_id, occurred_at DESC);
CREATE INDEX idx_interaction_type ON interaction_events(interaction_type);

COMMENT ON TABLE interaction_events IS '입주민 상호작용 통합. 미화로봇 마주침 + 공기청정로봇 바이탈/대화를 하나의 테이블로. 보안로봇 감지이벤트도 여기에 확장 가능.';


-- ============================================================================
-- 11. energy_logs — 에너지 소비량 ★IP핵심★ [라이온스봇#12, 나무엑스#12]
-- ============================================================================

CREATE TABLE energy_logs (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    robot_id            UUID NOT NULL REFERENCES robots(id),
    log_date            DATE NOT NULL,
    -- 일별 전력량
    energy_consumed_wh  DECIMAL(10,2) NOT NULL,    -- 일 소비 전력 (Wh)
    operating_hours     DECIMAL(6,2),              -- 가동 시간
    charging_hours      DECIMAL(6,2),              -- 충전 시간
    charge_cycles       INTEGER DEFAULT 0,         -- 충전 횟수
    -- 효율 지표
    energy_per_m2       DECIMAL(8,4),              -- Wh/m² (미화) 또는 Wh/m³처리공기 (공기청정)
    energy_per_hour     DECIMAL(8,2),              -- Wh/운행시간
    -- 메타
    notes               TEXT,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (robot_id, log_date)
);

CREATE INDEX idx_energy_robot_date ON energy_logs(robot_id, log_date DESC);

COMMENT ON TABLE energy_logs IS '★IP핵심: 로봇별 일/월 전력소비량. 에너지 효율 비교, 전력비 산정, ESG 리포트 원천.';


-- ============================================================================
-- 12. incidents — 에러로그 + 안전사고 [라이온스봇#11, 나무엑스#11]
-- ============================================================================

CREATE TABLE incidents (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    robot_id            UUID REFERENCES robots(id),
    zone_id             UUID REFERENCES zones(id),
    complex_id          UUID NOT NULL REFERENCES complexes(id),
    -- 분류
    severity            incident_severity NOT NULL DEFAULT 'LOW',
    status              incident_status NOT NULL DEFAULT 'OPEN',
    title               VARCHAR(300) NOT NULL,
    description         TEXT,
    -- 에러 상세
    error_code          VARCHAR(50),
    error_source        VARCHAR(50),       -- HARDWARE, SOFTWARE, NETWORK, SENSOR
    -- 안전
    is_safety_incident  BOOLEAN DEFAULT FALSE,
    resident_involved   BOOLEAN DEFAULT FALSE,
    -- 해결
    resolution          TEXT,
    resolved_at         TIMESTAMPTZ,
    -- 타임라인
    occurred_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_incidents_complex ON incidents(complex_id);
CREATE INDEX idx_incidents_status ON incidents(status);


-- ============================================================================
-- 13. operational_insights — IP 축적
-- ============================================================================

CREATE TABLE operational_insights (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    complex_id          UUID REFERENCES complexes(id),
    zone_id             UUID REFERENCES zones(id),
    robot_category      robot_category,
    -- 인사이트
    insight_type        VARCHAR(50) NOT NULL,
    title               VARCHAR(300) NOT NULL,
    description         TEXT NOT NULL,
    parameters_json     JSONB,
    confidence_score    DECIMAL(5,2),
    sample_size         INTEGER,
    is_applied          BOOLEAN DEFAULT FALSE,
    applied_at          TIMESTAMPTZ,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ============================================================================
-- 14. user_profiles — 사용자/권한
-- ============================================================================

CREATE TABLE user_profiles (
    id                  UUID PRIMARY KEY,   -- Supabase Auth UID
    email               VARCHAR(200) NOT NULL,
    display_name        VARCHAR(100),
    role                VARCHAR(20) NOT NULL DEFAULT 'VIEWER',
    assigned_complex_ids UUID[],
    phone               VARCHAR(20),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- 텔레메트리 → 로봇 상태 자동갱신
CREATE OR REPLACE FUNCTION update_robot_from_telemetry()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE robots SET
        last_seen_at = NEW.captured_at,
        latitude = COALESCE(NEW.latitude, latitude),
        longitude = COALESCE(NEW.longitude, longitude),
        current_zone_id = COALESCE(NEW.zone_id, current_zone_id),
        battery_pct = COALESCE(NEW.battery_pct, battery_pct),
        clean_water_pct = COALESCE(NEW.clean_water_pct, clean_water_pct),
        dirty_water_pct = COALESCE(NEW.dirty_water_pct, dirty_water_pct),
        updated_at = NOW()
    WHERE id = NEW.robot_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_telemetry_update_robot
    AFTER INSERT ON telemetry
    FOR EACH ROW
    EXECUTE FUNCTION update_robot_from_telemetry();

-- 미션 완료 → 로봇 누적 통계
CREATE OR REPLACE FUNCTION update_robot_cumulative()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'COMPLETED' AND (OLD.status IS NULL OR OLD.status != 'COMPLETED') THEN
        UPDATE robots SET
            total_missions = total_missions + 1,
            total_area_m2 = total_area_m2 + COALESCE(NEW.area_cleaned_m2, 0),
            total_hours = total_hours + COALESCE(NEW.duration_minutes, 0) / 60.0,
            updated_at = NOW()
        WHERE id = NEW.robot_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_mission_update_robot
    AFTER INSERT OR UPDATE ON missions
    FOR EACH ROW
    EXECUTE FUNCTION update_robot_cumulative();


-- ============================================================================
-- RLS (Supabase 필수)
-- ============================================================================

ALTER TABLE complexes ENABLE ROW LEVEL SECURITY;
ALTER TABLE zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE robots ENABLE ROW LEVEL SECURITY;
ALTER TABLE missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE telemetry ENABLE ROW LEVEL SECURITY;
ALTER TABLE path_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE consumables ENABLE ROW LEVEL SECURITY;
ALTER TABLE interaction_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE energy_logs ENABLE ROW LEVEL SECURITY;

-- 인증 사용자 읽기 (Phase 2에서 단지별 세분화)
CREATE POLICY "auth_read" ON complexes FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_read" ON zones FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_read" ON robots FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_read" ON missions FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_read" ON telemetry FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_read" ON path_logs FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_read" ON incidents FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_read" ON consumables FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_read" ON interaction_events FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_read" ON energy_logs FOR SELECT TO authenticated USING (true);

-- service_role 전체 CRUD
CREATE POLICY "svc_all" ON telemetry FOR ALL TO service_role USING (true);
CREATE POLICY "svc_all" ON path_logs FOR ALL TO service_role USING (true);
CREATE POLICY "svc_all" ON robots FOR ALL TO service_role USING (true);
CREATE POLICY "svc_all" ON missions FOR ALL TO service_role USING (true);
CREATE POLICY "svc_all" ON incidents FOR ALL TO service_role USING (true);
CREATE POLICY "svc_all" ON consumables FOR ALL TO service_role USING (true);
CREATE POLICY "svc_all" ON interaction_events FOR ALL TO service_role USING (true);
CREATE POLICY "svc_all" ON energy_logs FOR ALL TO service_role USING (true);

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE robots;
ALTER PUBLICATION supabase_realtime ADD TABLE missions;
ALTER PUBLICATION supabase_realtime ADD TABLE incidents;
ALTER PUBLICATION supabase_realtime ADD TABLE interaction_events;


-- ============================================================================
-- SEED DATA
-- ============================================================================

-- 8개 단지
INSERT INTO complexes (id, name, address, district, complex_grade, total_units) VALUES
('a1000001-0000-0000-0000-000000000001', '올림픽파크포레온', '강동구 둔촌동', '강동구', 'PREMIUM', 12032),
('a1000001-0000-0000-0000-000000000002', '개포자이프레지던스', '강남구 개포동', '강남구', 'PREMIUM', 1320),
('a1000001-0000-0000-0000-000000000003', 'The H 퍼스티어 아이파크', '강남구 개포동', '강남구', 'ULTRA_PREMIUM', 1957),
('a1000001-0000-0000-0000-000000000004', '타워팰리스 3차', '강남구 도곡동', '강남구', 'ULTRA_PREMIUM', 798),
('a1000001-0000-0000-0000-000000000005', '디에이치 아너힐즈', '강남구 개포동', '강남구', 'ULTRA_PREMIUM', 1316),
('a1000001-0000-0000-0000-000000000006', '래미안 퍼스티지', '서초구 반포동', '서초구', 'ULTRA_PREMIUM', 2444),
('a1000001-0000-0000-0000-000000000007', '갤러리아포레', '성동구 성수동', '성동구', 'PREMIUM', 536),
('a1000001-0000-0000-0000-000000000008', '트리마제', '성동구 성수동', '성동구', 'PREMIUM', 999);

-- 미화로봇 15대 (클로봇 라이온스봇)
INSERT INTO robots (serial_number, display_name, category, subtype, manufacturer, model, complex_id) VALUES
('CLB-W-001', '포레온-W01', 'CLEANING', 'WET_SCRUB', '클로봇', 'LionsBot R3 Scrub Pro', 'a1000001-0000-0000-0000-000000000001'),
('CLB-W-002', '포레온-W02', 'CLEANING', 'WET_SCRUB', '클로봇', 'LionsBot R3 Scrub Pro', 'a1000001-0000-0000-0000-000000000001'),
('CLB-W-003', '포레온-W03', 'CLEANING', 'WET_SCRUB', '클로봇', 'LionsBot R3 Scrub Pro', 'a1000001-0000-0000-0000-000000000001'),
('CLB-W-004', '포레온-W04', 'CLEANING', 'WET_SCRUB', '클로봇', 'LionsBot R3 Scrub Pro', 'a1000001-0000-0000-0000-000000000001'),
('CLB-W-005', '개포-W01', 'CLEANING', 'WET_SCRUB', '클로봇', 'LionsBot R3 Scrub Pro', 'a1000001-0000-0000-0000-000000000002'),
('CLB-D-006', '개포-D01', 'CLEANING', 'DRY_VACUUM', '클로봇', 'LionsBot R3 Scrub Pro', 'a1000001-0000-0000-0000-000000000002'),
('CLB-W-007', 'TheH-W01', 'CLEANING', 'WET_SCRUB', '클로봇', 'LionsBot R3 Scrub Pro', 'a1000001-0000-0000-0000-000000000003'),
('CLB-W-008', 'TheH-W02', 'CLEANING', 'WET_SCRUB', '클로봇', 'LionsBot R3 Scrub Pro', 'a1000001-0000-0000-0000-000000000003'),
('CLB-D-009', 'TheH-D01', 'CLEANING', 'DRY_VACUUM', '클로봇', 'LionsBot R3 Scrub Pro', 'a1000001-0000-0000-0000-000000000003'),
('CLB-D-010', 'TheH-D02', 'CLEANING', 'DRY_VACUUM', '클로봇', 'LionsBot R3 Scrub Pro', 'a1000001-0000-0000-0000-000000000003'),
('CLB-W-011', '타팰3-W01', 'CLEANING', 'WET_SCRUB', '클로봇', 'LionsBot R3 Scrub Pro', 'a1000001-0000-0000-0000-000000000004'),
('CLB-W-012', '아너힐즈-W01', 'CLEANING', 'WET_SCRUB', '클로봇', 'LionsBot R3 Scrub Pro', 'a1000001-0000-0000-0000-000000000005'),
('CLB-W-013', '퍼스티지-W01', 'CLEANING', 'WET_SCRUB', '클로봇', 'LionsBot R3 Scrub Pro', 'a1000001-0000-0000-0000-000000000006'),
('CLB-D-014', '갤러리아-D01', 'CLEANING', 'DRY_VACUUM', '클로봇', 'LionsBot R3 Scrub Pro', 'a1000001-0000-0000-0000-000000000007'),
('CLB-W-015', '트리마제-W01', 'CLEANING', 'WET_SCRUB', '클로봇', 'LionsBot R3 Scrub Pro', 'a1000001-0000-0000-0000-000000000008');

-- 소모품 유형 (미화 + 공기청정 공통)
INSERT INTO consumable_types (name, category, applicable_categories, unit_cost_krw, expected_lifespan_hours, lead_time_days) VALUES
('메인 브러시', 'BRUSH', '{CLEANING}', 85000, 500, 7),
('사이드 브러시', 'BRUSH', '{CLEANING}', 35000, 300, 7),
('스퀴지 블레이드', 'SQUEEGEE', '{CLEANING}', 45000, 400, 5),
('먼지 필터', 'FILTER', '{CLEANING}', 55000, 600, 10),
('폴리싱 패드', 'PAD', '{CLEANING}', 25000, 200, 5),
('HEPA 필터 (나무엑스)', 'HEPA', '{AIR_PURIFIER}', 120000, 2000, 14),
('프리필터 (나무엑스)', 'FILTER', '{AIR_PURIFIER}', 45000, 1000, 10);

-- 샘플 구역 (올림픽파크포레온)
INSERT INTO zones (complex_id, name, zone_type, floor_level, area_m2, floor_material, contamination_level, robot_accessible) VALUES
('a1000001-0000-0000-0000-000000000001', 'B1 주차장 A구역', 'PARKING_B1', 'B1', 3200, 'EPOXY', 'HIGH', TRUE),
('a1000001-0000-0000-0000-000000000001', 'B1 주차장 B구역', 'PARKING_B1', 'B1', 2800, 'EPOXY', 'HIGH', TRUE),
('a1000001-0000-0000-0000-000000000001', 'B2 주차장', 'PARKING_B2', 'B2', 5500, 'EPOXY', 'MEDIUM', TRUE),
('a1000001-0000-0000-0000-000000000001', '101동 로비', 'LOBBY', '1F', 180, 'MARBLE', 'MEDIUM', TRUE),
('a1000001-0000-0000-0000-000000000001', '커뮤니티센터 1층', 'COMMUNITY_CENTER', '1F', 800, 'PORCELAIN_TILE', 'LOW', TRUE),
('a1000001-0000-0000-0000-000000000001', '지하 연결통로 (계단)', 'CORRIDOR', 'B1', 120, 'POLISHED_CONCRETE', 'LOW', FALSE);


-- ============================================================================
-- 스키마 요약
-- ============================================================================
-- 베이스 테이블: 14개 (v3 대비 -3)
-- 파티션: 9개 (telemetry) + 9개 (path_logs) = 18개
-- 수집항목 매핑: 라이온스봇 12개 + 나무엑스 12개 = 24개 전량 매핑
-- 신규 IP 테이블: path_logs(커버리지율), energy_logs(전력효율), interaction_events(상호작용)
-- 제거: charging_docks(robots 흡수), contracts/billing(Phase2), firmware/api_health(제조사관제), daily_stats(쿼리도출)
-- 보안로봇 확장: robot_category ENUM에 SECURITY 포함, interaction_events에 확장 가능
-- ============================================================================
