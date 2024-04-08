import { getFeatureFlags } from '../../utils/configuration';
import OnCallEngineerConfig from './types/ServiceConfiguration';

const { enabled = false } = (getFeatureFlags()?.features?.on_call_engineer as OnCallEngineerConfig) || {};

export const isFeatureEnabled = () => {
  return enabled;
};
