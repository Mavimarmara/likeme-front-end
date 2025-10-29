declare module '@react-navigation/native' {
  export interface NavigationProp<ParamList, RouteName extends keyof ParamList = keyof ParamList> {
    navigate<RouteName extends keyof ParamList>(
      ...args: RouteName extends unknown
        ? undefined extends ParamList[RouteName]
          ? [screen: RouteName] | [screen: RouteName, params: ParamList[RouteName]]
          : [screen: RouteName, params: ParamList[RouteName]]
        : never
    ): void;
  }
}
