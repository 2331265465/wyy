import {MemberState} from "../reducers/member.reducer";
import {createFeatureSelector, createSelector} from "@ngrx/store";

const featureKey = 'member'
export const selectMember = createFeatureSelector<MemberState>(featureKey)

const selectMemberStates = (state:MemberState) => state


export const getModalVisible = createSelector(selectMemberStates,(state:MemberState) => state.modalVisible)
export const getModalType = createSelector(selectMemberStates,(state:MemberState) => state.modalType)
export const getUserId = createSelector(selectMemberStates,(state:MemberState) => state.userId)
