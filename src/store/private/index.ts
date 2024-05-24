import { create } from 'zustand'
import { selectionStateCreater } from '../creator'

const usePrivateSelection = create(selectionStateCreater)

export { usePrivateSelection }
