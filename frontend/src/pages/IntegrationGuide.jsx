import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    FileText,
    Copy,
    Check,
    CheckCircle2,
    AlertCircle,
    Code2,
    Key,
    Settings,
    Database,
    Users,
    Zap,
    Lock,
    LogOut,
    RefreshCw,
    UserCog,
    Mail,
    ChevronRight
} from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import ApplicationHeader from '../components/ApplicationHeader';
import api from '../services/api';
import applicationService from '../services/applicationService';
import env from '../config/env';

export default function IntegrationGuide() {
    const { appId } = useParams();
    const [application, setApplication] = useState(null);
    const [fields, setFields] = useState([]);
    const [apiKeys, setApiKeys] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [copiedId, setCopiedId] = useState(null);
    const [generatedCode, setGeneratedCode] = useState({});

    useEffect(() => {
        loadData();
    }, [appId]);

    const loadData = async () => {
        try {
            const [appRes, configRes, fieldsRes, keysRes, usersRes] = await Promise.all([
                applicationService.get(appId),
                api.get(`/admin/${appId}/auth-config`),
                api.get(`/admin/${appId}/fields`),
                api.get(`/admin/${appId}/api-keys`),
                api.get(`/admin/${appId}/users?limit=1`)
            ]);

            const appData = appRes.data;
            if (configRes.data.data) {
                appData.authConfig = configRes.data.data;
            }

            setApplication(appData);
            setFields(fieldsRes.data.data || []);
            setApiKeys(keysRes.data.data || []);

            const userList = usersRes.data.data?.content || usersRes.data.data || [];
            setUsers(userList);
        } catch (error) {
            console.error('Failed to load data:', error);
        } finally {
            setLoading(false);
        }
    };

    const copyCode = (text, id) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const getActiveApiKey = () => {
        const activeKey = apiKeys.find(k => k.active);
        return activeKey ? activeKey.publicKey : 'YOUR_API_KEY';
    };

    const getBaseUrl = () => {
        return `${env.apiBaseUrl}/api/auth`;
    };

    const generateSignupCode = () => {
        const baseUrl = getBaseUrl();
        const apiKey = getActiveApiKey();

        const body = {
            email: "user@example.com",
            password: "SecurePass123!"
        };

        // Add all custom fields
        fields.forEach(field => {
            let sampleValue;
            switch (field.fieldType) {
                case 'NUMBER': sampleValue = 12345; break;
                case 'BOOLEAN': sampleValue = true; break;
                case 'DATE': sampleValue = "2024-01-01"; break;
                default: sampleValue = `sample_${field.fieldName}`;
            }
            body[field.fieldName] = sampleValue;
        });

        return {
            request: `curl -X POST "${baseUrl}/signup" \\
  -H "X-API-Key: ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '${JSON.stringify(body, null, 2)}'`,
            success: {
                status: 201,
                body: JSON.stringify({
                    success: true,
                    message: "User created successfully",
                    data: {
                        id: "usr_1a2b3c4d5e6f",
                        email: "user@example.com",
                        emailVerified: false,
                        createdAt: "2024-01-15T10:30:00Z",
                        ...Object.fromEntries(Object.keys(body).filter(k => k !== 'email' && k !== 'password').map(k => [k, body[k]]))
                    }
                }, null, 2)
            },
            errors: [
                {
                    status: 400,
                    description: "Invalid request body",
                    body: JSON.stringify({
                        success: false,
                        error: "Validation failed",
                        details: ["Email is required", "Password must be at least 8 characters"]
                    }, null, 2)
                },
                {
                    status: 409,
                    description: "User already exists",
                    body: JSON.stringify({
                        success: false,
                        error: "User with this email already exists"
                    }, null, 2)
                },
                {
                    status: 401,
                    description: "Invalid API key",
                    body: JSON.stringify({
                        success: false,
                        error: "Invalid or missing API key"
                    }, null, 2)
                }
            ]
        };
    };

    const generateLoginCode = () => {
        const baseUrl = getBaseUrl();
        const apiKey = getActiveApiKey();
        const method = application?.authConfig?.loginMethod;

        const successResponse = {
            status: 200,
            body: JSON.stringify({
                success: true,
                message: "Login successful",
                data: {
                    accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                    refreshToken: "rt_1a2b3c4d5e6f7g8h9i0j",
                    tokenType: "Bearer",
                    expiresIn: 3600
                }
            }, null, 2)
        };

        const commonErrors = [
            {
                status: 401,
                description: "Invalid credentials",
                body: JSON.stringify({
                    success: false,
                    error: "Invalid email or password"
                }, null, 2)
            },
            {
                status: 401,
                description: "Invalid API key",
                body: JSON.stringify({
                    success: false,
                    error: "Invalid or missing API key"
                }, null, 2)
            }
        ];

        if (method === 'OTP') {
            return {
                request: [
                    {
                        title: "1. Request OTP",
                        content: `curl -X POST "${baseUrl}/request-otp?email=user@example.com" \\
  -H "X-API-Key: ${apiKey}"`
                    },
                    {
                        title: "2. Login with OTP",
                        content: `curl -X POST "${baseUrl}/login" \\
  -H "X-API-Key: ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "user@example.com",
    "otp": "123456"
  }'`
                    }
                ],
                success: successResponse,
                errors: [
                    {
                        status: 401,
                        description: "Invalid or expired OTP",
                        body: JSON.stringify({
                            success: false,
                            error: "Invalid or expired OTP code"
                        }, null, 2)
                    },
                    ...commonErrors
                ],
                note: "Use request-otp first, then login with the code received in email."
            };
        }

        if (method === 'MAGIC_LINK') {
            const defaultUrl = application?.authConfig?.defaultRedirectUrl;
            const hasDefault = !!defaultUrl;

            return {
                request: hasDefault
                    ? `curl -X POST "${baseUrl}/request-magic-link?email=user@example.com" \\
  -H "X-API-Key: ${apiKey}"`
                    : `curl -X POST "${baseUrl}/request-magic-link?email=user@example.com&redirectUrl=https://yourapp.com/callback" \\
  -H "X-API-Key: ${apiKey}"`,
                success: {
                    status: 200,
                    body: JSON.stringify({
                        success: true,
                        message: "Magic link sent to email"
                    }, null, 2)
                },
                errors: [
                    {
                        status: 404,
                        description: "User not found",
                        body: JSON.stringify({
                            success: false,
                            error: "No user found with this email"
                        }, null, 2)
                    },
                    {
                        status: 400,
                        description: "Invalid redirect URL",
                        body: JSON.stringify({
                            success: false,
                            error: "Redirect URL not in allowed origins"
                        }, null, 2)
                    },
                    ...commonErrors
                ],
                note: "User clicks link in email to complete login. Tokens are returned via redirect URL."
            };
        }

        if (method === 'OAUTH') {
            const requests = [];

            if (application?.authConfig?.googleClientId) {
                requests.push({
                    title: "Login with Google",
                    content: `// Use Client ID: ${application.authConfig.googleClientId}
// Get ID Token from Google SDK, then POST here:
curl -X POST "${baseUrl}/login" \\
  -H "X-API-Key: ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "provider": "GOOGLE",
    "providerToken": "PASTE_ID_TOKEN_HERE"
  }'`
                });
            }

            if (application?.authConfig?.githubClientId) {
                requests.push({
                    title: "Login with GitHub",
                    content: `curl -X POST "${baseUrl}/login" \\
  -H "X-API-Key: ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "provider": "GITHUB",
    "providerToken": "GITHUB_ACCESS_TOKEN_FROM_CLIENT"
  }'`
                });
            }

            if (application?.authConfig?.metaAppId) {
                requests.push({
                    title: "Login with Meta/Facebook",
                    content: `curl -X POST "${baseUrl}/login" \\
  -H "X-API-Key: ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "provider": "META",
    "providerToken": "FACEBOOK_ACCESS_TOKEN_FROM_CLIENT"
  }'`
                });
            }

            if (requests.length === 0) {
                // Fallback if OAUTH is selected but no provider configured (shouldn't happen ideally)
                requests.push({
                    title: "Login with OAuth",
                    content: `curl -X POST "${baseUrl}/login" \\
  -H "X-API-Key: ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "provider": "GOOGLE",
    "providerToken": "PROVIDER_TOKEN"
  }'`
                });
            }

            return {
                request: requests,
                success: successResponse,
                errors: commonErrors,
                note: "Requires valid access/ID token from the respective provider's SDK. This SINGLE request handles both Signup (auto-creation) and Login."
            };
        }

        // Default: PASSWORD
        return {
            request: `curl -X POST "${baseUrl}/login" \\
  -H "X-API-Key: ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!"
  }'`,
            success: successResponse,
            errors: commonErrors
        };
    };

    const generateGetProfileCode = () => {
        const baseUrl = getBaseUrl();
        const apiKey = getActiveApiKey();

        return {
            request: `curl -X GET "${baseUrl}/profile" \\
  -H "X-API-Key: ${apiKey}" \\
  -H "Authorization: Bearer ACCESS_TOKEN"`,
            success: {
                status: 200,
                body: JSON.stringify({
                    success: true,
                    data: {
                        id: "usr_1a2b3c4d5e6f",
                        email: "user@example.com",
                        emailVerified: true,
                        createdAt: "2024-01-15T10:30:00Z",
                        ...(fields.length > 0 ? Object.fromEntries(fields.slice(0, 2).map(f => [f.fieldName, f.fieldType === 'NUMBER' ? 12345 : 'sample_value'])) : {})
                    }
                }, null, 2)
            },
            errors: [
                {
                    status: 401,
                    description: "Unauthorized - Invalid or expired token",
                    body: JSON.stringify({
                        success: false,
                        error: "Invalid or expired access token"
                    }, null, 2)
                },
                {
                    status: 401,
                    description: "Invalid API key",
                    body: JSON.stringify({
                        success: false,
                        error: "Invalid or missing API key"
                    }, null, 2)
                }
            ]
        };
    };

    const generateUpdateProfileCode = () => {
        const baseUrl = getBaseUrl();
        const apiKey = getActiveApiKey();

        const updates = {};
        if (fields.length > 0) {
            fields.slice(0, 2).forEach(field => {
                updates[field.fieldName] = field.fieldType === 'NUMBER' ? 99999 : 'updated_value';
            });
        } else {
            updates.customField1 = 'new_value';
        }

        return {
            request: `curl -X PUT "${baseUrl}/profile" \\
  -H "X-API-Key: ${apiKey}" \\
  -H "Authorization: Bearer ACCESS_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '${JSON.stringify(updates, null, 2)}'`,
            success: {
                status: 200,
                body: JSON.stringify({
                    success: true,
                    message: "Profile updated successfully",
                    data: {
                        id: "usr_1a2b3c4d5e6f",
                        email: "user@example.com",
                        ...updates
                    }
                }, null, 2)
            },
            errors: [
                {
                    status: 401,
                    description: "Unauthorized",
                    body: JSON.stringify({
                        success: false,
                        error: "Invalid or expired access token"
                    }, null, 2)
                },
                {
                    status: 400,
                    description: "Validation error",
                    body: JSON.stringify({
                        success: false,
                        error: "Invalid field values"
                    }, null, 2)
                }
            ]
        };
    };

    const generateChangePasswordCode = () => {
        const baseUrl = getBaseUrl();
        const apiKey = getActiveApiKey();

        return {
            request: `curl -X PUT "${baseUrl}/change-password" \\
  -H "X-API-Key: ${apiKey}" \\
  -H "Authorization: Bearer ACCESS_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "currentPassword": "OldPass123!",
    "newPassword": "NewSecurePass456!"
  }'`,
            success: {
                status: 200,
                body: JSON.stringify({
                    success: true,
                    message: "Password changed successfully"
                }, null, 2)
            },
            errors: [
                {
                    status: 401,
                    description: "Current password incorrect",
                    body: JSON.stringify({
                        success: false,
                        error: "Current password is incorrect"
                    }, null, 2)
                },
                {
                    status: 400,
                    description: "Weak password",
                    body: JSON.stringify({
                        success: false,
                        error: "New password does not meet security requirements"
                    }, null, 2)
                }
            ]
        };
    };

    const generateForgotPasswordCode = () => {
        const baseUrl = getBaseUrl();
        const apiKey = getActiveApiKey();

        return {
            request: `curl -X POST "${baseUrl}/forgot-password" \\
  -H "X-API-Key: ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "user@example.com"
  }'`,
            success: {
                status: 200,
                body: JSON.stringify({
                    success: true,
                    message: "Password reset email sent"
                }, null, 2)
            },
            errors: [
                {
                    status: 404,
                    description: "User not found",
                    body: JSON.stringify({
                        success: false,
                        error: "No user found with this email"
                    }, null, 2)
                }
            ]
        };
    };

    const generateResetPasswordCode = () => {
        const baseUrl = getBaseUrl();
        const apiKey = getActiveApiKey();

        return {
            request: `curl -X POST "${baseUrl}/reset-password" \\
  -H "X-API-Key: ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "token": "RESET_TOKEN_FROM_EMAIL",
    "newPassword": "NewSecurePass456!"
  }'`,
            success: {
                status: 200,
                body: JSON.stringify({
                    success: true,
                    message: "Password reset successfully"
                }, null, 2)
            },
            errors: [
                {
                    status: 400,
                    description: "Invalid or expired token",
                    body: JSON.stringify({
                        success: false,
                        error: "Reset token is invalid or has expired"
                    }, null, 2)
                },
                {
                    status: 400,
                    description: "Weak password",
                    body: JSON.stringify({
                        success: false,
                        error: "Password does not meet security requirements"
                    }, null, 2)
                }
            ]
        };
    };

    const generateLogoutCode = () => {
        const baseUrl = getBaseUrl();
        const apiKey = getActiveApiKey();

        return {
            request: `curl -X POST "${baseUrl}/logout" \\
  -H "X-API-Key: ${apiKey}" \\
  -H "Authorization: Bearer ACCESS_TOKEN"`,
            success: {
                status: 200,
                body: JSON.stringify({
                    success: true,
                    message: "Logged out successfully"
                }, null, 2)
            },
            errors: [
                {
                    status: 401,
                    description: "Unauthorized",
                    body: JSON.stringify({
                        success: false,
                        error: "Invalid or expired access token"
                    }, null, 2)
                }
            ]
        };
    };

    const generateLogoutAllCode = () => {
        const baseUrl = getBaseUrl();
        const apiKey = getActiveApiKey();

        return {
            request: `curl -X POST "${baseUrl}/logout-all" \\
  -H "X-API-Key: ${apiKey}" \\
  -H "Authorization: Bearer ACCESS_TOKEN"`,
            success: {
                status: 200,
                body: JSON.stringify({
                    success: true,
                    message: "Logged out from all devices successfully"
                }, null, 2)
            },
            errors: [
                {
                    status: 401,
                    description: "Unauthorized",
                    body: JSON.stringify({
                        success: false,
                        error: "Invalid or expired access token"
                    }, null, 2)
                }
            ]
        };
    };

    const generateCode = (endpoint) => {
        const generators = {
            signup: generateSignupCode,
            login: generateLoginCode,
            profile: generateGetProfileCode,
            updateProfile: generateUpdateProfileCode,
            changePassword: generateChangePasswordCode,
            forgotPassword: generateForgotPasswordCode,
            resetPassword: generateResetPasswordCode,
            logout: generateLogoutCode,
            logoutAll: generateLogoutAllCode
        };

        const code = generators[endpoint]();
        setGeneratedCode({ ...generatedCode, [endpoint]: code });
    };

    const setupSteps = [
        {
            id: 'custom-fields',
            label: 'Custom Fields',
            icon: Database,
            completed: fields.length > 0,
            link: `/app/${appId}/custom-fields`,
            description: fields.length > 0 ? `${fields.length} fields configured` : 'Define user schema'
        },
        {
            id: 'auth-config',
            label: 'Auth Config',
            icon: Settings,
            completed: application?.authConfig != null,
            link: `/app/${appId}/auth-config`,
            description: application?.authConfig ? `${application.authConfig.authMode} / ${application.authConfig.loginMethod}` : 'Configure authentication'
        },
        {
            id: 'api-key',
            label: 'API Key',
            icon: Key,
            completed: apiKeys.length > 0 && apiKeys.some(k => k.active),
            link: `/app/${appId}`,
            description: apiKeys.length > 0 ? `${apiKeys.filter(k => k.active).length} active key(s)` : 'Generate API key'
        }
    ];

    const coreEndpoints = [
        {
            id: 'signup',
            title: 'User Signup',
            icon: UserCog,
            color: 'emerald',
            description: 'Register a new user with custom fields',
            badge: `${fields.length} custom fields`
        },
        {
            id: 'login',
            title: 'User Login',
            icon: Lock,
            color: 'blue',
            description: 'Authenticate user and receive tokens',
            badge: application?.authConfig?.loginMethod || 'Password'
        },
        {
            id: 'profile',
            title: 'Get User Profile',
            icon: Users,
            color: 'purple',
            description: 'Retrieve authenticated user details',
            badge: 'Protected'
        }
    ].filter(endpoint => {
        if (endpoint.id === 'signup' && application?.authConfig?.loginMethod === 'OAUTH') {
            return false;
        }
        return true;
    });

    const supportingEndpoints = [
        {
            id: 'updateProfile',
            title: 'Update Profile',
            icon: UserCog,
            color: 'cyan',
            description: 'Update user custom field values'
        },
        {
            id: 'changePassword',
            title: 'Change Password',
            icon: RefreshCw,
            color: 'indigo',
            description: 'Change authenticated user password'
        },
        {
            id: 'forgotPassword',
            title: 'Forgot Password',
            icon: Mail,
            color: 'yellow',
            description: 'Request password reset email'
        },
        {
            id: 'resetPassword',
            title: 'Reset Password',
            icon: Key,
            color: 'orange',
            description: 'Complete password reset with token'
        },
        {
            id: 'logout',
            title: 'Logout',
            icon: LogOut,
            color: 'red',
            description: 'Logout from current session'
        },
        {
            id: 'logoutAll',
            title: 'Logout All Devices',
            icon: LogOut,
            color: 'rose',
            description: 'Logout from all active sessions'
        }
    ];

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                </div>
            </DashboardLayout>
        );
    }

    const allStepsComplete = setupSteps.every(step => step.completed);

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto pb-12">
                <ApplicationHeader
                    application={application}
                    appId={appId}
                    activeTab="docs"
                    icon={FileText}
                />

                {/* Setup Progress */}
                <Card className="mb-8 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <Zap className="w-6 h-6 text-blue-400" />
                        <h2 className="text-xl font-bold text-white">Quick Setup</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {setupSteps.map((step, index) => (
                            <Link
                                key={step.id}
                                to={step.link}
                                className="no-underline"
                            >
                                <div className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${step.completed
                                    ? 'bg-emerald-500/10 border-emerald-500/30 hover:border-emerald-500/50'
                                    : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700'
                                    }`}>
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg ${step.completed ? 'bg-emerald-500/20' : 'bg-zinc-800'
                                                }`}>
                                                <step.icon className={`w-5 h-5 ${step.completed ? 'text-emerald-400' : 'text-zinc-400'
                                                    }`} />
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-semibold text-white">{step.label}</h3>
                                                <p className="text-xs text-zinc-500">{step.description}</p>
                                            </div>
                                        </div>
                                        {step.completed && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {!allStepsComplete && (
                        <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-yellow-200">
                                Complete all setup steps above to unlock fully configured API examples.
                            </p>
                        </div>
                    )}
                </Card>

                {/* Core Endpoints */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-purple-500/10 rounded-lg">
                            <Code2 className="w-5 h-5 text-purple-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-white tracking-tight">Core Authentication APIs</h2>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        {coreEndpoints.map(endpoint => (
                            <EndpointCard
                                key={endpoint.id}
                                endpoint={endpoint}
                                code={generatedCode[endpoint.id]}
                                onGenerate={() => generateCode(endpoint.id)}
                                onCopy={copyCode}
                                isCopied={copiedId === endpoint.id}
                            />
                        ))}
                    </div>
                </div>

                {/* Supporting Endpoints */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-cyan-500/10 rounded-lg">
                            <Zap className="w-5 h-5 text-cyan-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-white tracking-tight">Supporting APIs</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {supportingEndpoints.map(endpoint => (
                            <EndpointCard
                                key={endpoint.id}
                                endpoint={endpoint}
                                code={generatedCode[endpoint.id]}
                                onGenerate={() => generateCode(endpoint.id)}
                                onCopy={copyCode}
                                isCopied={copiedId === endpoint.id}
                                compact
                            />
                        ))}
                    </div>
                </div>

                {/* View Users CTA */}
                {users.length > 0 && (
                    <Card className="p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/30">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-500/20 rounded-lg">
                                    <Users className="w-6 h-6 text-blue-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white">Test Your Integration</h3>
                                    <p className="text-sm text-zinc-400">
                                        {users.length} user(s) created. View and manage them in the Users tab.
                                    </p>
                                </div>
                            </div>
                            <Link to={`/app/${appId}/users`}>
                                <Button variant="primary">
                                    View Users
                                    <ChevronRight className="w-4 h-4 ml-2" />
                                </Button>
                            </Link>
                        </div>
                    </Card>
                )}
            </div>
        </DashboardLayout>
    );
}

function EndpointCard({ endpoint, code, onGenerate, onCopy, isCopied, compact = false }) {
    const [copiedSection, setCopiedSection] = useState(null);

    const colorMap = {
        emerald: 'emerald',
        blue: 'blue',
        purple: 'purple',
        cyan: 'cyan',
        indigo: 'indigo',
        yellow: 'yellow',
        orange: 'orange',
        red: 'red',
        rose: 'rose'
    };

    const color = colorMap[endpoint.color] || 'blue';

    const copyToClipboard = (text, section) => {
        navigator.clipboard.writeText(text);
        setCopiedSection(section);
        setTimeout(() => setCopiedSection(null), 2000);
    };

    const CodeBlock = ({ title, content, section, language = 'bash' }) => (
        <div className="mb-4">
            <div className="flex items-center justify-between bg-zinc-900/50 px-4 py-2 rounded-t-xl border border-zinc-800">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                    {title}
                </span>
                <button
                    onClick={() => copyToClipboard(content, section)}
                    className="text-zinc-500 hover:text-white transition-colors"
                >
                    {copiedSection === section ?
                        <Check className="w-4 h-4 text-green-500" /> :
                        <Copy className="w-4 h-4" />
                    }
                </button>
            </div>
            <pre className="bg-black/80 p-4 rounded-b-xl border border-t-0 border-zinc-800 font-mono text-xs leading-relaxed text-zinc-300 overflow-x-auto max-h-[250px]">
                <code>{content}</code>
            </pre>
        </div>
    );

    return (
        <Card className="overflow-hidden border-zinc-800">
            <div className={`p-6 border-b border-zinc-800 bg-${color}-500/5`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className={`p-3 bg-${color}-500/20 rounded-lg`}>
                            <endpoint.icon className={`w-6 h-6 text-${color}-400`} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white">{endpoint.title}</h3>
                            <p className="text-sm text-zinc-400">{endpoint.description}</p>
                        </div>
                    </div>
                    {endpoint.badge && (
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-${color}-500/20 text-${color}-300`}>
                            {endpoint.badge}
                        </span>
                    )}
                </div>
            </div>

            <div className="p-6">
                {!code ? (
                    <Button
                        onClick={onGenerate}
                        variant="primary"
                        className="w-full"
                    >
                        <Code2 className="w-4 h-4 mr-2" />
                        Generate Code
                    </Button>
                ) : (
                    <div className="space-y-4">
                        {code.note && (
                            <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                                <p className="text-xs text-blue-300">
                                    <span className="font-bold">Note:</span> {code.note}
                                </p>
                            </div>
                        )}

                        {Array.isArray(code.request) ? (
                            code.request.map((req, idx) => (
                                <CodeBlock
                                    key={idx}
                                    title={req.title}
                                    content={req.content}
                                    section={`request-${idx}`}
                                />
                            ))
                        ) : (
                            <CodeBlock
                                title="Request"
                                content={code.request}
                                section="request"
                            />
                        )}

                        <CodeBlock
                            title={`Success Response (${code.success.status})`}
                            content={code.success.body}
                            section="success"
                            language="json"
                        />

                        {code.errors && code.errors.length > 0 && (
                            <div>
                                <h4 className="text-sm font-bold text-zinc-300 mb-3">Error Responses</h4>
                                {code.errors.map((error, index) => (
                                    <CodeBlock
                                        key={index}
                                        title={`${error.status} - ${error.description}`}
                                        content={error.body}
                                        section={`error-${index}`}
                                        language="json"
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </Card>
    );
}
