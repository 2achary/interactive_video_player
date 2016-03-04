$("video").on('timeupdate', function(){
  $currentTime = $("video")[0].currentTime;

  jQuery.each($("span"), function(key, value){
    $(this).removeClass("highlight");
  });

  for (var id in timeMap) {
    offset = -0.2;
    min = timeMap[id][0] + offset;
    max = timeMap[id][1] + offset;
    if ($currentTime > min && $currentTime < max){
      $("#" + id).addClass("highlight");
    }
  }
});

timeMap = {
  1: [0.240, 4.130],
  2: [4.130, 7.535],
  3: [7.535, 11.270],
  4: [11.270, 13.960],
  5: [13.960, 17.940],
  6: [17.940, 22.370],
  7: [22.370, 26.880],
  8: [26.880, 30.920],
  9: [32.100, 34.730],
  10: [34.730, 39.430],
  11: [39.430, 41.190],
  12: [42.350, 46.300],
  13: [46.300, 49.270],
  14: [49.270, 53.760],
  15: [53.760, 57.780],
  16: [57.780, 60.150]
};

$(document).ready(function() {

	// video
	var $video = $("#video");

	// Buttons
	var $playButton = $("#play-pause");
	var $muteButton = $("#mute");
	var $fullScreenButton = $("#full-screen");
	var $currentTime = $('#current-time');
  var videoDom = $video.get(0);

	// Event listener for the play/pause button
  $playButton.on("click", function() {
		if ($video.get(0).paused === true) {
			// Play the video
			$video.get(0).play();

			// Update the button text to 'Pause'
			$playButton.html("");
			// background: color image position/size repeat origin clip attachment initial|inherit;
			$playButton.css('background', 'url("icons/pause-icon.png") center/14px no-repeat');
		} else {
			// Pause the video
			$video.get(0).pause();

			// Update the button text to 'Play'
			$playButton.html("");
			$playButton.css('background', 'url("icons/play-icon.png") center/14px no-repeat');
		}
	});

	// Event listener for the mute button
	$muteButton.on("click", function() {
		if ($video.get(0).muted === false) {
			// Mute the video
			$video.get(0).muted = true;

			// Update the button text
			$muteButton.css('background', 'url("icons/volume-off-icon.png") center/14px no-repeat');
		} else {
			// Unmute the video
			$video.get(0).muted = false;

			// Update the button text
			$muteButton.css('background', 'url("icons/volume-on-icon.png") center/15px no-repeat');
		}
	});

	// Event listener for the full-screen button
	$fullScreenButton.on("click", function() {
		if ($video.get(0).requestFullscreen) {
			$video.get(0).requestFullscreen();
		} else if ($video.get(0).mozRequestFullScreen) {
			$video.get(0).mozRequestFullScreen(); // Firefox
		} else if ($video.get(0).webkitRequestFullscreen) {
			$video.get(0).webkitRequestFullscreen(); // Chrome and Safari
		}
	});

	// Event listener for the seek bar
	$('.progress').on("click", function(e) {
		// Calculate the new time
    var barWidth = $(this).width();
    var parentOffset = $(this).offset();
    var relX = e.pageX - parentOffset.left;
    console.log(relX);
    console.log(barWidth);
    var barPos = (relX/barWidth) * 100;
		var time = $video.get(0).duration * (barPos / 100);

		// Update the video time
		$video.get(0).currentTime = time;
	});

	// Update the seek bar as the video plays
	$video.on("timeupdate", function() {
		// Calculate the slider value
    var dur = $video.get(0).duration;
		var value = (100 / dur) * $video.get(0).currentTime;

		// Update the slider value
		var currentSeconds = $video.get(0).currentTime;
		// var seconds = Math.floor(currentSeconds);
		var timeString = prettify_duration(currentSeconds) + ' / ' + prettify_duration(dur);
		$currentTime.html(timeString);
	});

	// Pause the video when the seek handle is being dragged
	$('.progress').on("mousedown", function() {
		$video.get(0).pause();
    $playButton.css('background', 'url("icons/play-icon.png") center/14px no-repeat');
	});

	// Play the video when the seek handle is dropped
	$('.progress').on("mouseup", function() {
		$video.get(0).play();
    $playButton.css('background', 'url("icons/pause-icon.png") center/14px no-repeat');
	});

  videoDom.addEventListener('progress', function() {
    var len = videoDom.buffered.length;
    if (len > 0){
      var bufferedEnd = videoDom.buffered.end(videoDom.buffered.length - 1);
      var duration =  videoDom.duration;
      if (duration > 0) {
        $('#buffered-amount').css('width', ((bufferedEnd / duration)*100) + "%");
      }
    }
  });

  videoDom.addEventListener('timeupdate', function() {
    var duration =  videoDom.duration;
    if (duration > 0) {
      $('#progress-amount').css('width', ((videoDom.currentTime / duration)*100) + "%");
    }
  });
});

function str_pad_left(string,pad,length) {
    return (new Array(length+1).join(pad)+string).slice(-length);
}

function prettify_duration(duration){
  var minutes = Math.floor(duration / 60);
  var seconds = Math.floor(duration) - minutes * 60;
  return str_pad_left(minutes,'0',2)+':'+str_pad_left(seconds,'0',2);
}
