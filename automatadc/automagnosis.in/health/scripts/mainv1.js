'use strict';

const applicationServerPublicKey = 'BP5hLbdwUAGdvjCmfpXzH6xrbEdHSW8bEv1qdOB0SOWuaVCElWkzWodoEQtmulqoJ8skXA3kAQM4hHp6eRJ5tC0';

let isSubscribed = false;
let swRegistration = null;

function urlB64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

if ('serviceWorker' in navigator && 'PushManager' in window) {
  console.log('Service Worker and Push is supported');

  navigator.serviceWorker.register('https://www.docsapp.in/health/sw.js')
    .then(function (swReg) {
      console.log('Service Worker is registered', swReg);

      swRegistration = swReg;
    })
    .catch(function (error) {
      console.error('Service Worker Error', error);
    });
} else {
  console.warn('Push messaging is not supported');
}

function initializeUI() {
  setTimeout(function() {
    if (isSubscribed) {
      // TODO: Unsubscribe user
      unsubscribeUser();
    } else {
      subscribeUser();
    }
  }, 3000)

  // Set the initial subscription value
  swRegistration.pushManager.getSubscription()
    .then(function (subscription) {
      isSubscribed = !(subscription === null);

      updateSubscriptionOnServer(subscription);

      if (isSubscribed) {
        console.log('User IS subscribed.');
      } else {
        console.log('User is NOT subscribed.');
      }

      updateBtn();
    });
}

function updateBtn() {
  if (Notification.permission === 'denied') {
    updateSubscriptionOnServer(null);
    return;
  }
}

function subscribeUser() {
  const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
  swRegistration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: applicationServerKey
    })
    .then(function (subscription) {
      console.log('User is subscribed.');

      updateSubscriptionOnServer(subscription);

      isSubscribed = true;

      updateBtn();
    })
    .catch(function (err) {
      console.log('Failed to subscribe the user: ', err);
      updateBtn();
    });
}

function unsubscribeUser() {
  swRegistration.pushManager.getSubscription()
    .then(function (subscription) {
      if (subscription) {
        return subscription.unsubscribe();
      }
    })
    .catch(function (error) {
      console.log('Error unsubscribing', error);
    })
    .then(function () {
      updateSubscriptionOnServer(null);

      console.log('User is unsubscribed.');
      isSubscribed = false;

      updateBtn();
    });
}

function updateSubscriptionOnServer(subscription) {
  // TODO: Send subscription to application server
  postDetails(subscription);
}

/*  */

function postDetails(tokenData) {
  if(tokenData === null) return;
  let data = {};
  let xhr = new XMLHttpRequest();

  data['subscription'] = tokenData;
  data['patientId'] = null;
  data['source'] = 'seoPages';
  data['endpoint'] = tokenData['endpoint'];

  xhr.open('POST', 'https://www.docsapp.in/health/seousers/pusher');
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onload = function () {
    if (xhr.status === 201) {
      console.log('Request submitted ' + xhr.responseText);
    } else {
      console.log('Request failed ' + xhr.status);
    }
  };
  xhr.send((JSON.stringify(data)))
}

navigator.serviceWorker.register('https://www.docsapp.in/health/sw.js')
  .then(function (swReg) {
    console.log('Service Worker is registered', swReg);

    swRegistration = swReg;
    initializeUI();
  })