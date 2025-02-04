### NOTICE

# Prebuild the app

`npx expo prebuild`

# Prebuild the app for only the android

`npx expo prebuild --platform android`

# Prebuild the app for only the ios

`npx expo prebuild --platform ios`

# Update the app when update the app.json

`npx expo prebuild --clean`

# Install the app

`npm install`

# Start the development server

`npm run start`

# Start the development server clearing the cache

`npm run start -c`

`npx expo start -c`

# Start the development build only the android device or emulator

`npx expo run:android --device`

# Start the development build only the ios device or emulator

`npx expo run:ios --device`

# Install the pod dependencies for ios when add a new dependency need to run this command

`cd ios && pod install && cd ..`

# Generate locales when create a new locale file

`npm run generate-locales`

# Uncommon issues while starting the project

I experience the bug while trying to run `npx expo run:ios --device`:

```
Error: EMFILE: too many open files, watch at FSEvent.FSWatcher._handle.onchange (node:internal/fs/watchers:207:21)
```

Despite thousands times trying to reinstall the package and watchman, I still got the bug.
Here is the solution:

```
brew install watchan # reinstall if need
watchman shutdown-server
watchman watch .
watchman watch-list | jq '.roots | length' # should return 1
```
