import { create } from 'zustand'
import { selectionStateCreater } from '../creator'

const useDeletedSelection = create(selectionStateCreater)

export { useDeletedSelection }
