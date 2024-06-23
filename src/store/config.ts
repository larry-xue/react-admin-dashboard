import { MappingAlgorithm, theme } from 'antd'
import { uniq } from 'lodash-es'
import { create } from 'zustand'

type ConfigState = {
  themeConfig: {
    algorithm: MappingAlgorithm[],
    _algorithm: string[],
    primaryColor: string
  },
  themeOptions: { label: string, value: string }[],
}

type Actions = {
  setAlgorithm: (v: string) => void
  setCompactAlgorithm: (v: string) => void
}

const algorithmMap: Record<string, MappingAlgorithm> = {
  default: theme.defaultAlgorithm,
  dark: theme.darkAlgorithm,
  compact: theme.compactAlgorithm
}

const useConfigStore = create<ConfigState & Actions>()((set) => ({
  themeConfig: {
    _algorithm: ['default'],
    algorithm: [theme.defaultAlgorithm],
    primaryColor: '#03dac6'
  },
  themeOptions: [
    { label: 'Light', value: 'default' },
    { label: 'Dark', value: 'dark' },
    { label: 'Compact', value: 'compact' },
  ],
  setAlgorithm: (v: string) => {
    set((state) => {
      const includesCompact = state.themeConfig._algorithm.includes('compact')
      const _algorithm = includesCompact ? [v, 'compact'] : [v]

      return {
        themeConfig: {
          _algorithm,
          algorithm: _algorithm.map((item) => algorithmMap[item]),
          primaryColor: state.themeConfig.primaryColor
        }
      }
    })
  },
  setCompactAlgorithm: (v: string) => {
    set((state) => {
      const withoutCompact = state.themeConfig._algorithm.filter((item) => item !== 'compact')
      const _algorithm = uniq(v ? [...withoutCompact, 'compact'] : withoutCompact)

      return ({
        themeConfig: {
          _algorithm,
          algorithm: _algorithm.map((item) => algorithmMap[item]),
          primaryColor: state.themeConfig.primaryColor
        }
      })
    })
  }
}))

export default useConfigStore
