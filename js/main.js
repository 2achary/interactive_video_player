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

  var isDragging = false;
  var isMouseDown = false;

  $(".progress")
  .mousedown(function() {
    //record the mousedown event and set dragging to false
    isDragging = false;
    isMouseDown = true;
    // pause the video and change the icon when the progress bar is clicked
    $video.get(0).pause();
    $playButton.css('background', 'url("icons/play-icon.png") center/14px no-repeat');
  })
  .mousemove(function(e) {
      if (!isMouseDown) {
        return;
      }
      // if it gets to here, the mouse is down and moving (dragging)
      isDragging = true;

      // update the time to match the mouse
      var barWidth = $(this).width();
      var parentOffset = $(this).offset();
      var relX = e.pageX - parentOffset.left;
      var barPos = (relX/barWidth) * 100;
  		var time = $video.get(0).duration * (barPos / 100);
  		$video.get(0).currentTime = time;
      var duration =  videoDom.duration;

      // update the progress bar width to match the mouse
      if (duration > 0) {
        $('#progress-amount').css('width', ((videoDom.currentTime / duration)*100) + "%");
      }
   })
  .mouseup(function(e) {
    // record state before flipping
    var wasDragging = isDragging;
    // falsify the dragging and mouse down statuses
    isDragging = false;
    isMouseDown = false;
    // if there was no dragging, we still need to update the prog bar and time
    if (!wasDragging){
      var barWidth = $(this).width();
      var parentOffset = $(this).offset();
      var relX = e.pageX - parentOffset.left;
      var barPos = (relX/barWidth) * 100;
      var time = $video.get(0).duration * (barPos / 100);
      // Update the video time
      $video.get(0).currentTime = time;
    }
    $video.get(0).play();
    $playButton.css('background', 'url("icons/pause-icon.png") center/14px no-repeat');
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
