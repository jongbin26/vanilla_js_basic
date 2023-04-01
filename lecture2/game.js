//document가 모두 렌더링되면 아래 자바스크립트 파일 실행
$(document).ready(function () {
	// -- 데이터 정의 --

	// 공의 개수
	var circleNumber = 0;

	// 공의 종류 - 크기(지름) / 크기(반지름) / 색 / 움직이는 속도
	var circleType = {
		option: ['color', 'width', 'border-radius', 'speed'],
		small: ['black', 5, 2.5, 3000], // 단위 시간당 걸리는 시간(ms)
		medium: ['blue', 15, 7.5, 4000],
		large: ['yellow', 30, 15, 5000],
	};

	// e.g. circleChoice라는 변수에 small
	// circleTypes[circleChoice][0] : 색
	// circleTypes[circleChoice][1] : 지름
	// circleTypes[circleChoice][2] : 반지름
	// circleTypes[circleChoice][3] : 속도

	// 시간을 찍어주는 변수
	var t = 0;

	// 게임 실행 여부
	var gameOn = false;

	// 마우스 좌표
	var mouseX;
	var mouseY;

	// ----------------------------------------------------------

	// 마우스 움직임을 감지해서 마우스 좌표 변수에 담아주는 함수
	$('body').mousemove(function () {
		mouseX = event.pageX;
		mouseY = event.pageY;
	});
	// 타이머 함수
	function timer() {
		if (gameOn == true) {
			// 0.01 (10ms)마다 t값을 0.01 증가시키고
			//증가된 t값을 timer 클래스 하위 html에 찍어주기
			setTimeout(function () {
				t = t + 0.01;
				$('.timer').html(`<h1><div class="center">${t.toFixed(2)}</div></h1>`);
				timer();
			}, 10);
		}
	}
	// 시작 버튼 함수
	$(".startbutton").click(function(){
		//시작에 해당하는 코드
		$(".startbutton").fadeToggle(500, function(){
			gameOn = true
			timer();
			$(".space").mouseenter(function(){
				//게임 종료 함수
				endGame();
			})
			//공을 생성해주는 함수
			createCircle();
		});
	});
	
	//공을 생성하는 함수
	function createCircle(){
		circleNumber++;
		//small medium large 중 랜덤하게 생성
		//1부터 3까지의 숫자 중 하나를 랜덤 생성
		var randomOneThree = Math.floor((3 * Math.random())+1);
		
		if(randomOneThree == 1){
			var circleChoice = "small";
		}else if(randomOneThree == 2){
			var circleChoice = "medium";
		}else if(randomOneThree == 3){
			var circleChoice = "large";
		}
		
		//공의 id 값을 지정
		var circleName = "circle" + circleNumber;
		
		//랜덤으로 생성된 circleChoice 맞는 color, size, radius, speed 변수에 담기
		var circleColor = circleType[circleChoice][0];
		var circleSize = circleType[circleChoice][1];
		var circleRadius = circleType[circleChoice][2];
		var circleSpeed = circleType[circleChoice][3];
		
		// 공이 움직일 수 있는 범위
		var moveableWidth = $("body").width() - circleSize;
		var moveableHeight = $("body").height() - circleSize;
		
		// 공의 초기 시작 좌표
		var circlePositionLeft = (moveableWidth * Math.random()).toFixed();
		var circlePositionTop = (moveableHeight * Math.random()).toFixed();
		
		var newCircle = `<div class='circle' id="${circleName}"></div>`;
		$("body").append(newCircle);
		
		$("#"+circleName).css({
			//css 코드
			"background-color" : circleColor,
			"width" : circleSize + "vmin",
			"height" : circleSize + "vmin",
			"border-radius" : circleRadius + "vmin",
			"top" : circlePositionTop + "px",
			"left" : circlePositionLeft + "px",
		});
		
		// 1ms 마다 반복 실행하며 마우스와 거리 계산
		function timeCirclePosition(circleTrackId){
			setTimeout(function(){
				var currentCirclePosition = $(circleTrackId).position();
				var calculateRadius = parseInt($(circleTrackId).css("width")) * 0.5;
				
				var distanceX = mouseX - (currentCirclePosition.left + calculateRadius);
				var distanceY = mouseY - (currentCirclePosition.top + calculateRadius);
				
				if(Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY, 2)) <= calculateRadius){
					$(circleTrackId).removeClass("circle").addClass('redcircle');
					$(circleTrackId).css("background-color" , "red");
					endGame();
				}
				timeCirclePosition(circleTrackId);
			}, 1)
		}
		timeCirclePosition("#" + circleName);
		
		animateCircle(circleName, circleSpeed, circleSize);
		
		setTimeout(function(){
			if(gameOn == true){
				createCircle();
			}
		}, 3000)
	}
	
	function animateCircle(circleId, speed, circleSize){
		// animate()
		// css 위치를 이동시키는 함수
		
		var moveableWidth = $("body").width() - circleSize;
		var moveableHeight = $("body").height() - circleSize;
		
		var circleMoveLeft = (moveableWidth * Math.random()).toFixed();
		var circleMoveTop = (moveableHeight * Math.random()).toFixed();
		
		$("#" + circleId).animate({
			left : circleMoveLeft,
			top : circleMoveTop,
		}, speed, function(){
			animateCircle(circleId, speed, circleSize);
		})
	}
	//게임 오버 함수
	function endGame(){
		if(gameOn == true){
			gameOn = false;
			updateScore(t);
			$(".circle").remove();
			$('.redcircle').stop();
			
		}
	}
	
	var resetButton = "<div class='resetButton center'><h2>Play Again</h2></div>";
	var highScore1 = 0.00;
	var highScore2 = 0.00;
	var highScore3 = 0.00;
	var highScore4 = 0.00;
	var highScore5 = 0.00;
	
	function updateScore(newScore){
		newScore += 0.01;
		// newScore가 highScore1보다 높은 경우
		if(newScore > highScore1){
			var redScore = "score1";
			highScore5 = highScore4
			highScore4 = highScore3
			highScore3 = highScore2
			highScore2 = highScore1
			highScore1 = newScore
			
		}else if(newScore > highScore2){
			var redScore = "score2";
			highScore5 = highScore4
			highScore4 = highScore3
			highScore3 = highScore2
			highScore2 = newScore
		}else if(newScore > highScore3){
			var redScore = "score3";
			highScore5 = highScore4
			highScore4 = highScore3
			highScore3 =newScore
		}else if(newScore > highScore4){
			var redScore = "score4";
			highScore5 = highScore4
			highScore4 = newScore
		}else if(newScore > highScore5){
			var redScore = "score5";
			highScore5 = newScore
		}
		
		var highScorePlace1 = "<div class='score center' id='score1'><h2>" + highScore1.toFixed(2) + "</h2></div>";
		var highScorePlace2 = "<div class='score center' id='score2'><h2>" + highScore2.toFixed(2) + "</h2></div>";
		var highScorePlace3 = "<div class='score center' id='score3'><h2>" + highScore3.toFixed(2) + "</h2></div>";
		var highScorePlace4 = "<div class='score center' id='score4'><h2>" + highScore4.toFixed(2) + "</h2></div>";
		var highScorePlace5 = "<div class='score center' id='score5'><h2>" + highScore5.toFixed(2) + "</h2></div>";
		
		$("#highscores").append(highScorePlace1, highScorePlace2, highScorePlace3, highScorePlace4, highScorePlace5, resetButton);
		$("#"+redScore).css("color", "red");
		$("#highscores").toggle();
		
		$(".resetButton").click(function(){
			gameReset();
		});
	}
	
	function gameReset(){
		$("#highscores").fadeToggle(100, function(){
			t = 0;
			$('.timer').html(`<h1><div class="center">${t.toFixed(2)}</div></h1>`);
			$('.resetButton').remove();
			$('.score').remove();
			$('.startbutton').toggle();
			$('.redcircle').remove();
		});
	}
	
});