
export interface Certificate {
    id: string;
    name: string;
    mimeType: string;
    webViewLink: string;
    webContentLink?: string;
    thumbnailLink?: string;
    createdTime?: string;
    category?: string;
}

export interface PortfolioData {
    profileImage: string;
    cvLink: string;
    certificates: Certificate[];
}
