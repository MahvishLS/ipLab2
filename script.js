// if ('Notification' in window && 'serviceWorker' in navigator) {
//     Notification.requestPermission().then((permission) => {
//         if (permission === 'granted') {
//             console.log('Notification permission granted');
            
//         }
//     });
// }


// navigator.serviceWorker.ready.then(function (registration) {
//     return registration.pushManager.subscribe({
//         userVisibleOnly: true,
//         applicationServerKey: 'your-public-vapid-key-here' 
//     });
// }).then(function(subscription) {
//     console.log('User is subscribed:', subscription);
    
// }).catch(function(error) {
//     console.error('Failed to subscribe the user: ', error);
// });
