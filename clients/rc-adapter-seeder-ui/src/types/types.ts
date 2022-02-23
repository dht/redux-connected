export enum IProviderLocation {
    CLIENT = 'CLIENT',
    SERVER = 'SERVER',
    ISO = 'ISO',
}

export enum IProviderType {
    ADAPTER = 'ADAPTER',
    CONNECTOR = 'CONNECTOR',
}

export enum IProviderSubtype {
    NETWORK = 'NETWORK',
    DB = 'DB',
    SAAS = 'SAAS',
    LSAAS = 'LSAAS',
}

export type IProvider = {
    id: string;
    location: IProviderLocation;
    type: IProviderType;
    subtype: IProviderSubtype;
};

export type ICapabilities = {
    scaffolding: boolean;
    seeding: boolean;
    getMany: boolean;
    getSingle: boolean;
    updateSingle: boolean;
    updateMany: boolean;
    sorting: boolean;
    pagination: boolean;
    deletion: boolean;
    filteringSingleField: boolean;
    filteringMultiField: boolean;
};

export type IAvailability = ICapabilities & {
    descriptionOfLimitations?: string;
};

export type IProviderWithInfo = IProvider & {
    implemented: Partial<ICapabilities>;
    availability: Partial<IAvailability>;
};

export type IProviders = IProvider[];
export type IProvidersWithInfo = IProviderWithInfo[];
