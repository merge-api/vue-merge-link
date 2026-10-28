import { DefineComponent, Plugin } from "vue";

export type AdditionalSuccessfulLinkInfo = {
  isTokenForOtherPreexistingLinkedAccount?: boolean;
};

export type ValidationError = {
  detail: string;
  problem_type?: string;
  [key: string]: any;
};

export type ValidationErrors = ValidationError[];

export type FilePickerObjectType = "FILE" | "FOLDER" | "DRIVE";

export type MergeFileStorageData = {
  outputType?: FilePickerObjectType;
  id: string;
  name?: string;
  description?: string;
  url?: string;
  updatedAt?: string;
  size?: number;
  mime_type?: string;
};

export type FilePickerConfig = {
  onSubmit: (returnVal: Array<MergeFileStorageData>) => void;
  types?: FilePickerObjectType[];
  allowMultiSelect?: boolean;
};

export interface TenantConfig {
  apiBaseURL?: string;
}

export type MergeLinkProps = {
  linkToken?: string;
  tenantConfig?: TenantConfig;
  /**
   * Make Link call `onSuccess` immediately after an account has been successfully linked instead of after the user closes the Link modal.
   * Defaults to `true` as of v3.0.0. The default is `false` in prior versions.
   */
  shouldSendTokenOnSuccessfulLink?: boolean;
  onReady?: () => void;
  onSuccess?: (publicToken: string, additionalInfo?: AdditionalSuccessfulLinkInfo) => void;
  onExit?: () => void;
  onValidationError?: (errors: ValidationErrors) => void;
  /**
   * Passing this optional input will allow users to use the File Picker
   */
  filePickerConfig?: FilePickerConfig;
  /**
   * Passing this allows users to target a specific element in their page to embed link under (eg for modals)
   */
  parentContainerID?: string;
};

declare const MergeLink: DefineComponent<MergeLinkProps> & Plugin;

export default MergeLink;
