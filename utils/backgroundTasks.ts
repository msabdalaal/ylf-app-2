import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import { retryPendingComments } from './commentQueue';

export const BACKGROUND_TASK_NAME = 'retry-pending-comments';

// Register the background task
TaskManager.defineTask(BACKGROUND_TASK_NAME, async () => {
  try {
    console.log('Running background task: retry pending comments');
    await retryPendingComments();
    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (error) {
    console.error('Background task failed:', error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

// Initialize background fetch
const MINIMUM_INTERVAL = 15 * 60; // 15 minutes in seconds

export const registerBackgroundTask = async () => {
  try {
    // Check if task is already registered
    const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_TASK_NAME);
    
    if (!isRegistered) {
      await BackgroundFetch.registerTaskAsync(BACKGROUND_TASK_NAME, {
        minimumInterval: MINIMUM_INTERVAL,
        stopOnTerminate: false, // Continue task when app is terminated
        startOnBoot: true, // Start task when device is rebooted
      });
      console.log('Background task registered');
    }
  } catch (error) {
    console.error('Failed to register background task:', error);
  }
};

export const unregisterBackgroundTask = async () => {
  try {
    await BackgroundFetch.unregisterTaskAsync(BACKGROUND_TASK_NAME);
    console.log('Background task unregistered');
  } catch (error) {
    console.error('Failed to unregister background task:', error);
  }
};
