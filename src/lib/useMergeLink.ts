import { type MaybeRef, type MaybeRefOrGetter, isReactive, isRef, onMounted, ref, toRef, toValue, unref, watch } from 'vue'
import type { OpenLinkProps, UseMergeLinkProps } from './types'

export const useMergeLink = (config?: MaybeRefOrGetter<UseMergeLinkProps>) => {
  const isReady = ref(false)
  const src = 'https://cdn.merge.dev/initialize.js'

  let _promise: Promise<unknown> | null = null

  onMounted(async () => {
    _promise = loadScript()
    await initialize()
  })

  const loadScript = () => {
    return new Promise(function (resolve, reject) {
      if (!document) {
        resolve(undefined)
        return
      }

      if (document.querySelector<HTMLScriptElement>('script[src="' + src + '"]')) {
        resolve(undefined)
        return
      }
      const el = document.createElement('script')
      el.type = 'text/javascript'
      el.async = true
      el.src = src
      el.addEventListener('load', resolve)
      el.addEventListener('error', reject)
      el.addEventListener('abort', reject)
      document.head.appendChild(el)
    })
  }

  const initialize = async () => {
    await _promise
    const configValue = toValue(config)

    window.MergeLink.initialize({
      linkToken: configValue?.linkToken,
      tenantConfig: configValue?.tenantConfig,
      shouldSendTokenOnSuccessfulLink: configValue?.shouldSendTokenOnSuccessfulLink ?? true,
      onExit: configValue?.onExit,
      onSuccess: configValue?.onSuccess,
      onValidationError: configValue?.onValidationError,
      onReady: () => (isReady.value = true),
      filePickerConfig: configValue?.filePickerConfig
    })
  }

  if (config && (isReactive(config) || isRef(config))) {
    watch(config, () => initialize(), { deep: true })
  }

  const open = (openConfig?: MaybeRef<OpenLinkProps>) =>
    window.MergeLink.openLink(unref(openConfig))

  return { open, isReady: toRef(() => isReady.value) }
}
