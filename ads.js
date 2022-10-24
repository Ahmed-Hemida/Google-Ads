var audioElement;
// Define a variable to track whether there are ads loaded and initially set it to false
var adsLoaded = false;
var adContainer;
var adDisplayContainer;
var adsLoader;
var adsManager;


window.addEventListener('load', function(event) {
  audioElement = document.getElementById('video-element');
  initializeIMA();
  audioElement.addEventListener('play', function(event) {
    loadAds(event);
  });
//   var playButton = document.getElementById('play-button');
//   playButton.addEventListener('click', function(event) {
//     audioElement.play();
//   });
});

window.addEventListener('resize', function(event) {
  console.log("window resized");
  if(adsManager) {
    var width = audioElement.clientWidth;
    var height = audioElement.clientHeight;
    adsManager.resize(width, height, google.ima.ViewMode.NORMAL);
  }

});

function initializeIMA() {
    console.log("initializing IMA");
    adContainer = document.getElementById('ad-container');
    adContainer.addEventListener('click', adContainerClick);
    google.ima.settings.setDisableCustomPlaybackForIOS10Plus(true);
    // debugger;
    adDisplayContainer = new google.ima.AdDisplayContainer(adContainer, audioElement);
    adsLoader = new google.ima.AdsLoader(adDisplayContainer);
    adsLoader.addEventListener(
        google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
        onAdsManagerLoaded,
        false);
    adsLoader.addEventListener(
        google.ima.AdErrorEvent.Type.AD_ERROR,
        onAdError,false);

      // Let the AdsLoader know when the video has ended
    audioElement.addEventListener('ended', function() {
        adsLoader.contentComplete();
    });

    var adsRequest = new google.ima.AdsRequest();
    adsRequest.adTagUrl = 'https://pubads.g.doubleclick.net/gampad/ads?' +
        'iu=/21775744923/external/single_ad_samples&sz=640x480&' +
        'cust_params=sample_ct%3Dlinear&ciu_szs=300x250%2C728x90&' +
        'gdfp_req=1&output=vast&unviewed_position_start=1&env=vp&impl=s&correlator=';
  
    // Specify the linear and nonlinear slot sizes. This helps the SDK to
    // select the correct creative if multiple are returned.
    adsRequest.linearAdSlotWidth = audioElement.clientWidth;
    adsRequest.linearAdSlotHeight = audioElement.clientHeight;
    adsRequest.nonLinearAdSlotWidth = audioElement.clientWidth;
    adsRequest.nonLinearAdSlotHeight = audioElement.clientHeight / 3;
  
    // Pass the request to the adsLoader to request ads
    adsLoader.requestAds(adsRequest);

}

function loadAds(event) {
  // Prevent this function from running on if there are already ads loaded
  if(adsLoaded) {
    return;
  }
  adsLoaded = true;

  // Prevent triggering immediate playback when ads are loading
  event.preventDefault();
  adwindow = document.getElementById('ad-window');
  adwindow.style.display="block";


  console.log("loading ads");
      // Initialize the container. Must be done via a user action on mobile devices.
      audioElement.load();
      adDisplayContainer.initialize();
    
      var width = audioElement.clientWidth;
      var height = audioElement.clientHeight;
      try {
        adsManager.init(width, height, google.ima.ViewMode.NORMAL);
        adsManager.start();
      } catch (adError) {
        // Play the video without ads, if an error occurs
        console.log("AdsManager could not be started");
        audioElement.play();
      }
}
  function onAdsManagerLoaded(adsManagerLoadedEvent) {
    // Instantiate the AdsManager from the adsLoader response and pass it the video element
    adsManager = adsManagerLoadedEvent.getAdsManager(
        audioElement);
        adsManager.addEventListener(
            google.ima.AdErrorEvent.Type.AD_ERROR,
            onAdError);

    adsManager.addEventListener(
        google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED,
        onContentPauseRequested);
    adsManager.addEventListener(
        google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED,
        onContentResumeRequested);
        adsManager.addEventListener(
            google.ima.AdEvent.Type.LOADED,
            onAdLoaded);
      }
    
    
  
function onContentPauseRequested() {
    audioElement.pause();
  }
  
function onContentResumeRequested() {
    adwindow = document.getElementById('ad-window');
  adwindow.style.display="none";

    audioElement.play();
  }
  function onAdError(adErrorEvent) {
    // Handle the error logging.
    console.log(adErrorEvent.getError());
    if(adsManager) {
      adsManager.destroy();
    }
  }
  function adContainerClick(event) {
    console.log("ad container clicked");
    if(audioElement.paused) {
      audioElement.play();
    } else {
      audioElement.pause();
    }
  }
  function onAdLoaded(adEvent) {
    var ad = adEvent.getAd();
    if (!ad.isLinear()) {
      audioElement.play();
    }
  }



  
