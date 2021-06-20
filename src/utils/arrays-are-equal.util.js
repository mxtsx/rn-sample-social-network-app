export function arraysAreEqualUtil(state, action){
    return !(state.sort() > action.sort() || state.sort() < action.sort())
}