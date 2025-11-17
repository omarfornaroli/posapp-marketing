import { Observable, timer } from 'rxjs';
import { map } from 'rxjs/operators';

export type SubscriptionStatus = 'Activa' | 'Inactiva' | 'Pendiente';

const statuses: SubscriptionStatus[] = ['Activa', 'Inactiva', 'Pendiente'];

// Simulate a status check every 5 seconds, starting immediately.
export const subscriptionStatus$: Observable<SubscriptionStatus> = timer(0, 5000).pipe(
  map((i) => {
    // In a real app, this would be an API call.
    // Here, we'll just cycle through the statuses for demonstration.
    return statuses[i % statuses.length];
  })
);
