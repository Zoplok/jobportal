#!/bin/bash
# =====================================================================
# Job Portal — End-to-End Test Script
# =====================================================================
# Run with:  bash test.sh
# Make sure the server is running (npm run dev) and MySQL is up first.
# =====================================================================

BASE_URL="http://localhost:3000"

echo ""
echo "=== 1. Registering Employer ==="
curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email":"employer@test.com","password":"pass123","role":"EMPLOYER"}'
echo ""

echo ""
echo "=== 2. Registering Candidate ==="
curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email":"candidate@test.com","password":"pass123","role":"CANDIDATE"}'
echo ""

echo ""
echo "=== 3. Login as Employer ==="
EMPLOYER_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"employer@test.com","password":"pass123"}')
echo "$EMPLOYER_RESPONSE"
EMPLOYER_TOKEN=$(echo "$EMPLOYER_RESPONSE" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
echo "Token: $EMPLOYER_TOKEN"
echo ""

echo ""
echo "=== 4. Login as Candidate ==="
CANDIDATE_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"candidate@test.com","password":"pass123"}')
echo "$CANDIDATE_RESPONSE"
CANDIDATE_TOKEN=$(echo "$CANDIDATE_RESPONSE" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
echo "Token: $CANDIDATE_TOKEN"
echo ""

echo ""
echo "=== 5. Create a Job (Employer) ==="
curl -s -X POST "$BASE_URL/jobs" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $EMPLOYER_TOKEN" \
  -d '{"title":"Backend Developer","description":"Build APIs with Node.js","location":"UB","salary":"2000000"}'
echo ""

echo ""
echo "=== 6. List All Jobs (Public) ==="
curl -s "$BASE_URL/jobs"
echo ""

echo ""
echo "=== 7. Filter Jobs by Location ==="
curl -s "$BASE_URL/jobs?location=UB"
echo ""

echo ""
echo "=== 8. Apply to Job (Candidate) ==="
curl -s -X POST "$BASE_URL/applications" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $CANDIDATE_TOKEN" \
  -d '{"jobPostId":1,"coverLetter":"I am a great fit for this role!"}'
echo ""

echo ""
echo "=== 9. Employer Views Applications for Job 1 ==="
curl -s "$BASE_URL/applications/job/1" \
  -H "Authorization: Bearer $EMPLOYER_TOKEN"
echo ""

echo ""
echo "=== 10. Employer Accepts Application ==="
curl -s -X PUT "$BASE_URL/applications/1/status" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $EMPLOYER_TOKEN" \
  -d '{"status":"ACCEPTED"}'
echo ""

echo ""
echo "=== 11. Candidate Checks Applications ==="
curl -s "$BASE_URL/applications/my" \
  -H "Authorization: Bearer $CANDIDATE_TOKEN"
echo ""

echo ""
echo "=== 12. GraphQL: Query Jobs in UB ==="
curl -s -X POST "$BASE_URL/graphql" \
  -H "Content-Type: application/json" \
  -d '{"query":"{ jobs(location: \"UB\") { id title location salary } }"}'
echo ""

echo ""
echo "=== 13. Create a Resume (Candidate) ==="
curl -s -X POST "$BASE_URL/resumes" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $CANDIDATE_TOKEN" \
  -d '{"title":"My Resume","skills":["JavaScript","Node.js","MySQL"],"experience":[{"company":"TechCo","role":"Junior Dev","years":1}]}'
echo ""

echo ""
echo "=== 14. Test 401 — No Token on Protected Route ==="
echo "Expected: 401 Unauthorized"
curl -s -w "\nHTTP Status: %{http_code}\n" "$BASE_URL/applications/my"
echo ""

echo ""
echo "=== 15. Test 403 — Candidate Tries to Create a Job ==="
echo "Expected: 403 Forbidden"
curl -s -w "\nHTTP Status: %{http_code}\n" -X POST "$BASE_URL/jobs" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $CANDIDATE_TOKEN" \
  -d '{"title":"Fake Job","description":"Should fail","location":"Nowhere"}'
echo ""

echo ""
echo "=== ALL TESTS DONE ==="
echo ""
