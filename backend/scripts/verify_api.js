const { execSync } = require('child_process');

const BASE_URL = 'http://localhost:8085/api';
const TIMESTAMP = Date.now();

// Helper to execute and print curl
function runCurl(description, command) {
    console.log('\n' + '='.repeat(60));
    console.log(`STEP: ${description}`);
    console.log('-'.repeat(60));
    console.log(`COMMAND:\n${command}`);
    console.log('-'.repeat(60));

    try {
        // Execute curl
        // Use -s to hide progress bar, but we want output
        const output = execSync(command + ' -s', { encoding: 'utf-8' });
        console.log(`OUTPUT:\n${output}`);

        try {
            // Find JSON object using regex (greedy matching for nested braces is hard in JS, assuming standard structure)
            const jsonMatch = output.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
            return JSON.parse(output);
        } catch (e) {
            return output; // Return raw if not JSON
        }
    } catch (e) {
        console.error(`ERROR EXECUTION FAILED: ${e.message}`);
        return null;
    }
}

function main() {
    console.log('Starting End-to-End API Verification via cURL...');

    // ==========================================
    // 1. CLIENT ONBOARDING
    // ==========================================
    const clientEmail = `client_${TIMESTAMP}@test.com`;
    const clientPassword = 'Password123!';

    // 1.1 Client Signup
    runCurl('Client Signup', `curl -X POST "${BASE_URL}/clients/signup" -H "Content-Type: application/json" -d "{\\"companyName\\":\\"Test Corp\\", \\"email\\":\\"${clientEmail}\\", \\"password\\":\\"${clientPassword}\\"}"`);

    // 1.2 Client Login
    const loginResp = runCurl('Client Login', `curl -X POST "${BASE_URL}/clients/login" -H "Content-Type: application/json" -d "{\\"email\\":\\"${clientEmail}\\", \\"password\\":\\"${clientPassword}\\"}"`);

    if (!loginResp || !loginResp.data || !loginResp.data.token) {
        console.error('CRITICAL: Failed to login client. Aborting.');
        process.exit(1);
    }
    const clientToken = loginResp.data.token;
    const clientId = loginResp.data.clientId || 'unknown'; // Might need to decode token if not in response, but usually login returns user/client info? 
    // Checking ClientResponse DTO: it returns accessToken, refreshToken, expiresIn.
    // Client ID is NOT in the response body directly usually in standard AuthResponse.
    // However, for Client flow, maybe we need to fetch info.
    // Let's assume we can proceed with just the token.

    console.log(`\n>>> Client Authenticated. Token acquired.`);

    // ==========================================
    // 2. SCENARIO A: JWT + PASSWORD + BCRYPT
    // ==========================================
    const appAName = `App_Standard_${TIMESTAMP}`;
    const createAppACmd = `curl -X POST "${BASE_URL}/applications" \\
      -H "Authorization: Bearer ${clientToken}" \\
      -H "Content-Type: application/json" \\
      -d "{\\"appName\\":\\"${appAName}\\", \\"environment\\":\\"DEVELOPMENT\\", \\"authConfig\\": { \\"authMode\\": \\"JWT\\", \\"loginMethod\\": \\"PASSWORD\\", \\"passwordHashAlgorithm\\": \\"BCRYPT\\", \\"signupEnabled\\": true }}"`;

    const appAResp = runCurl('Create Application A (JWT/PASSWORD/BCRYPT)', createAppACmd.replace(/\\/g, '').replace(/\n/g, ' '));

    if (!appAResp || !appAResp.data || !appAResp.data.apiKey) {
        console.error('Failed to create App A');
    } else {
        const apiKeyA = appAResp.data.apiKey;
        const appIdA = appAResp.data.id;
        console.log(`>>> App A Created. API Key: ${apiKeyA}`);

        // 2.1 User Signup (App A)
        const userAEmail = `userA_${TIMESTAMP}@example.com`;
        runCurl('App A: User Signup', `curl -X POST "${BASE_URL}/auth/signup" -H "X-API-Key: ${apiKeyA}" -H "Content-Type: application/json" -d "{\\"email\\":\\"${userAEmail}\\", \\"password\\":\\"UserPass123!\\"}"`);

        // 2.2 User Login (App A)
        const loginAResp = runCurl('App A: User Login', `curl -X POST "${BASE_URL}/auth/login" -H "X-API-Key: ${apiKeyA}" -H "Content-Type: application/json" -d "{\\"email\\":\\"${userAEmail}\\", \\"password\\":\\"UserPass123!\\"}"`);

        if (loginAResp && loginAResp.data && loginAResp.data.accessToken) {
            const userAToken = loginAResp.data.accessToken;
            // 2.3 User Profile (App A)
            runCurl('App A: Get Profile', `curl -X GET "${BASE_URL}/auth/profile" -H "X-API-Key: ${apiKeyA}" -H "Authorization: Bearer ${userAToken}"`);
        }
    }

    // ==========================================
    // 3. SCENARIO B: SESSION + OTP + ARGON2
    // ==========================================
    const appBName = `App_Secure_${TIMESTAMP}`;
    const createAppBCmd = `curl -X POST "${BASE_URL}/applications" \\
      -H "Authorization: Bearer ${clientToken}" \\
      -H "Content-Type: application/json" \\
      -d "{\\"appName\\":\\"${appBName}\\", \\"environment\\":\\"PRODUCTION\\", \\"authConfig\\": { \\"authMode\\": \\"SESSION\\", \\"loginMethod\\": \\"OTP\\", \\"passwordHashAlgorithm\\": \\"ARGON2\\", \\"signupEnabled\\": true, \\"emailVerificationRequired\\": true }}"`;

    const appBResp = runCurl('Create Application B (SESSION/OTP/ARGON2)', createAppBCmd.replace(/\\/g, '').replace(/\n/g, ' '));

    if (appBResp && appBResp.data) {
        const apiKeyB = appBResp.data.apiKey;
        console.log(`>>> App B Created. API Key: ${apiKeyB}`);

        // 3.1 User Signup (App B)
        // Even with OTP login, initial registration usually requires email (and maybe password if hybrid, but strict OTP might just be "request OTP" for login).
        // If "LoginMethod" is OTP, signup might still set a password OR it's passwordless signup?
        // Let's assume standard signup sets up the user account.
        const userBEmail = `userB_${TIMESTAMP}@example.com`;
        runCurl('App B: User Signup', `curl -X POST "${BASE_URL}/auth/signup" -H "X-API-Key: ${apiKeyB}" -H "Content-Type: application/json" -d "{\\"email\\":\\"${userBEmail}\\", \\"password\\":\\"IgnoredIfPureOTP123!\\"}"`);

        // 3.2 Request OTP (App B)
        runCurl('App B: Request OTP', `curl -X POST "${BASE_URL}/auth/request-otp?email=${userBEmail}" -H "X-API-Key: ${apiKeyB}"`);

        // Note: We cannot easily fetch the OTP content from the console/logs programmatically here without complex parsing.
        // So we will skip the actual "Login with OTP" step unless we mock the OTP or have a fixed seed.
        // But we have demonstrated the flow up to request.
        console.log('>>> NOTE: OTP sent to console. Skipping Login verification for OTP path as it requires manual code extraction.');
    }

    // ==========================================
    // 4. SCENARIO C: API_TOKEN + MAGIC_LINK + PBKDF2
    // ==========================================
    const appCName = `App_Legacy_${TIMESTAMP}`;
    const createAppCCmd = `curl -X POST "${BASE_URL}/applications" \\
      -H "Authorization: Bearer ${clientToken}" \\
      -H "Content-Type: application/json" \\
      -d "{\\"appName\\":\\"${appCName}\\", \\"environment\\":\\"STAGING\\", \\"authConfig\\": { \\"authMode\\": \\"API_TOKEN\\", \\"loginMethod\\": \\"MAGIC_LINK\\", \\"passwordHashAlgorithm\\": \\"PBKDF2\\", \\"signupEnabled\\": true }}"`;

    const appCResp = runCurl('Create Application C (API_TOKEN/MAGIC_LINK/PBKDF2)', createAppCCmd.replace(/\\/g, '').replace(/\n/g, ' '));

    if (appCResp && appCResp.data) {
        const apiKeyC = appCResp.data.apiKey;
        console.log(`>>> App C Created. API Key: ${apiKeyC}`);

        const userCEmail = `userC_${TIMESTAMP}@example.com`;
        runCurl('App C: User Signup', `curl -X POST "${BASE_URL}/auth/signup" -H "X-API-Key: ${apiKeyC}" -H "Content-Type: application/json" -d "{\\"email\\":\\"${userCEmail}\\", \\"password\\":\\"PassC123!\\"}"`);

        runCurl('App C: Request Magic Link', `curl -X POST "${BASE_URL}/auth/request-magic-link?email=${userCEmail}" -H "X-API-Key: ${apiKeyC}"`);
    }

    console.log('\nVerification Complete.');
}

main();
