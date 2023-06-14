const mapping: Record<string, string> = {
  companies: 'company',
  features: 'feature',
  feedbacks: 'feedback',
  goals: 'goal',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
