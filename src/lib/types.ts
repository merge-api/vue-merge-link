export type AdditionalSuccessfulLinkInfo = {
  isTokenForOtherPreexistingLinkedAccount?: boolean;
};

export type ValidationErrors = ValidationError[];

export type ValidationError = {
  detail: string;
  problem_type?: string;
  [key: string]: any;
};

export type MergeFileStorageData = {
  type?: FilePickerObjectType;
  id: string;
  name?: string;
  description?: string;
  url?: string;
  updatedAt?: string;
  size?: number;
  mime_type?: string;
};

export enum FilePickerObjectType {
  FILE = 'FILE',
  FOLDER = 'FOLDER',
  DRIVE = 'DRIVE',
}

export type FilePickerConfig = {
  onSubmit: (returnVal: Array<MergeFileStorageData>) => void;
  types?: FilePickerObjectType[];
  allowMultiSelect?: boolean;
};

export interface TenantConfig {
  apiBaseURL?: 'https://api.merge.dev' | 'https://api-ap.merge.dev' | 'https://api-eu.merge.dev' | string;
}
export interface UseMergeLinkProps {
  linkToken?: string;
  tenantConfig?: TenantConfig;
  onValidationError?: (errors: ValidationErrors) => void;
  onSuccess?: (
    publicToken: string,
    additionalInfo?: AdditionalSuccessfulLinkInfo
  ) => void;
  onExit?: () => void;
  /**
   * Make Link call `onSuccess` immediately after an account has been successfully linked instead of after the user closes the Link modal.
   * Defaults to `true` as of v2.0.0. The default is `false` in prior versions.
   */
  shouldSendTokenOnSuccessfulLink?: boolean | undefined;
  /**
   * Passing this optional input into useMergeLink will allow users to use the File Picker
   */
  filePickerConfig?: FilePickerConfig;
}

export interface InitializeProps extends UseMergeLinkProps {
  onReady?: () => void;
}

export interface OpenLinkProps {
  linkToken?: string;
  onSuccess?: (
    publicToken: string,
    additionalInfo?: AdditionalSuccessfulLinkInfo
  ) => void;
  onExit?: () => void;
}

export interface MergeLinkWindow {
  initialize: (config: InitializeProps) => void;
  openLink: (config?: OpenLinkProps) => void;
}

declare global {
  interface Window {
    MergeLink: MergeLinkWindow;
  }
}