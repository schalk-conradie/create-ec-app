
const getAuthToken = async (): Promise<string> => {
    const tokenModule = await import("../../token.json");
    const token = tokenModule.default.accessToken;
    return token;
};

export const getApiUrl = (): string => {
    if (window.parent && window.parent.Xrm) {
        const globalContext = window.Xrm.Utility.getGlobalContext();
        const clientUrl = globalContext.getClientUrl();
        return `${clientUrl}/api/data/v9.2`;
    }

    return "https://DOMAIN.REGION.dynamics.com/api/data/v9.2";
};

export const getAuthHeaders = async (): Promise<HeadersInit> => {
    if (window.parent && window.parent.Xrm) {
        return {
            "Content-Type": "application/json",
            "OData-MaxVersion": "4.0",
            "OData-Version": "4.0",
            Prefer: 'odata.include-annotations="*"',
        };
    }

    const token = await getAuthToken();
    const headers: HeadersInit = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "OData-MaxVersion": "4.0",
        "OData-Version": "4.0",
        Prefer: 'odata.include-annotations="*"',
    };

    return headers;
};