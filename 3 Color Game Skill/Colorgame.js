var data = {};
var user = {};
data.life = 3;
data.y = 0;
data.i = Math.floor(Math.random()*10);
data.j = Math.floor(Math.random()*10);
data.score = 0;
user.color = " ";
user.state = " ";
var colors = ['yellow','black','red','blue','orange','brown','purple','green','pink','gray'];
				
function main(){
	if(user.state === "start"){	
		data = fall();
		console.log(data);
		var canvas = document.getElementById('myCanvas');
		var context = canvas.getContext('2d');	
		context.clearRect(0,0,500,500);
		context.font = "50px Comic Sans MS";
		context.fillStyle = colors[data.i];
		context.fillText(colors[data.j],250, data.y);
	}else if(user.state === "stop"){
		var canvas = document.getElementById('myCanvas');
		var context = canvas.getContext('2d');
		context.clearRect(0,0,500,500);
		context.font = "30px Comic Sans MS";
		context.fillText("Thank you for playing",150,200);
		context.fillText("You Scored: " + data.score,200,300);
	}
}

function fall(){	
				if(data.y === 500){
					data.y = 0;
					data.i = Math.floor(Math.random()*10);
					data.j = Math.floor(Math.random()*10);
					data.life = data.life - 1;
					document.getElementById("Life").innerText = data.life;
					if (data.life < 0){
						alert("Game Over");
						document.location.reload();
					}
				}else{
					data.y = data.y + 50;
					if (user.color === colors[data.i]){
						data.score = data.score + 1;
						document.getElementById("Points").innerText = data.score;
						data.y = 0;
						data.i = Math.floor(Math.random()*10);
						data.j = Math.floor(Math.random()*10);
					}	
				}
				return data;
}
function SetData(input){
	user.color = input.Color;
	user.state = input.Status;
	console.log(user);
}	

setInterval(function(){main();},1000);

