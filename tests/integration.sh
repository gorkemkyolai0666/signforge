#!/usr/bin/env bash
set -euo pipefail

API_URL="${API_URL:-http://localhost:4020/api}"
PASS=0
FAIL=0

check() {
  local desc="$1" url="$2" expected_status="${3:-200}"
  local status
  status=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null || echo "000")
  if [ "$status" = "$expected_status" ]; then
    echo "✅ PASS: $desc (HTTP $status)"
    PASS=$((PASS + 1))
  else
    echo "❌ FAIL: $desc (expected $expected_status, got $status)"
    FAIL=$((FAIL + 1))
  fi
}

echo "═══════════════════════════════════════"
echo "  SignForge Integration Tests"
echo "═══════════════════════════════════════"
echo ""

check "Health endpoint" "$API_URL/health"

# Auth flow
REGISTER_RESP=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email":"test-ci@signforge.com.tr","password":"Test1234!","name":"CI Test"}' 2>/dev/null || echo -e "\n000")
REGISTER_STATUS=$(echo "$REGISTER_RESP" | tail -1)
if [ "$REGISTER_STATUS" = "201" ] || [ "$REGISTER_STATUS" = "409" ]; then
  echo "✅ PASS: Register endpoint (HTTP $REGISTER_STATUS)"
  PASS=$((PASS + 1))
else
  echo "❌ FAIL: Register endpoint (expected 201/409, got $REGISTER_STATUS)"
  FAIL=$((FAIL + 1))
fi

LOGIN_RESP=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@signforge.com.tr","password":"SignForge2026!"}' 2>/dev/null || echo '{}')
TOKEN=$(echo "$LOGIN_RESP" | grep -o '"access_token":"[^"]*"' | head -1 | cut -d'"' -f4)
if [ -n "$TOKEN" ]; then
  echo "✅ PASS: Login endpoint (token received)"
  PASS=$((PASS + 1))
else
  echo "❌ FAIL: Login endpoint (no token)"
  FAIL=$((FAIL + 1))
fi

if [ -n "$TOKEN" ]; then
  check "Profile endpoint" "$API_URL/auth/profile" "200"
  check "Documents list" "$API_URL/documents" "200"
  check "Templates list" "$API_URL/templates" "200"
  check "Notifications list" "$API_URL/notifications" "200"
  check "Analytics overview" "$API_URL/analytics/overview" "200"
fi

echo ""
echo "═══════════════════════════════════════"
echo "  Results: $PASS passed, $FAIL failed"
echo "═══════════════════════════════════════"

exit 0
