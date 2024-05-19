import { create } from 'zustand'
import { searchStateCreator, selectionStateCreater } from '../creator'

const useHomeSelect = create(selectionStateCreater)
const useHomeSearch = create(searchStateCreator)

export { useHomeSearch, useHomeSelect }
