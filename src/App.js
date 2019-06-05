import React from 'react';
import { useSpring, animated } from 'react-spring';
import './App.css';

function App() {
  const camera = {
    x: 0,
    y: 0,
    z: 0,

    move: function({ x = 0, y = 0, z = 0} = {}) {
      this.x += x;
      this.y += y;
      this.z += z;

      return `rotateX(${this.x}deg) rotateY(${this.y}deg) rotateZ(${this.z}deg)`;
    }
  }

  const cameraControl = (movement) => {
    return {
      do: () => squaresSet({ transform: camera.move(movement) })
    }
  };

  const squareControl = (set) => {
    return {
      toggle: false,
      do: function() {
        this.toggle = !this.toggle;

        set({
          height: this.toggle ? '0%' : '100%', 
          width: this.toggle ? '0%' : '100%', 
          backgroundColor: this.toggle ? '#33313B' : '#D65A31'
        })
      } 
    }
  };

  const squareSpringDefault = () => {
    return {
      height: '0%', 
      width: '0%', 
      backgroundColor: '#33313B'
    };
  };

  const cameraSpringDefault = () => {
    return {
      transform: camera.move()
    };
  };

  const [squaresProps,           squaresSet]           = useSpring(() => cameraSpringDefault());
  const [upperLeftSquareProps,   upperLeftSquareSet]   = useSpring(() => squareSpringDefault());
  const [upperRightSquareProps,  upperRightSquareSet]  = useSpring(() => squareSpringDefault());
  const [bottomLeftSquareProps,  bottomLeftSquareSet]  = useSpring(() => squareSpringDefault());
  const [bottomRightSquareProps, bottomRightSquareSet] = useSpring(() => squareSpringDefault());

  const keyMappings = {
    38: cameraControl({ x:  45  }),
    40: cameraControl({ x: -45  }),
    37: cameraControl({ y: -45  }),
    39: cameraControl({ y:  45  }),
    32: cameraControl({ z:  90  }),
    81: squareControl(upperLeftSquareSet),
    87: squareControl(upperRightSquareSet),
    65: squareControl(bottomLeftSquareSet),
    83: squareControl(bottomRightSquareSet)
  };

  const voiceMappings = {
    'up':    cameraControl({ x:  45  }),
    'down':  cameraControl({ x: -45  }),
    'left':  cameraControl({ y: -45  }),
    'right': cameraControl({ y:  45  }),
    'spin':  cameraControl({ z:  90  })
  };

  document.addEventListener("keydown", (event) => {
    if(keyMappings[event.keyCode]) {
      keyMappings[event.keyCode].do();
    }
  });

  document.body.onload = () => {
    const recognition = new window.webkitSpeechRecognition();
    recognition.continuos = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 1;
  
    recognition.onend = () => { 
      recognition.start() 
    };
  
    recognition.onresult = (event) => {
      const whatISaid = event.results[event.resultIndex][0].transcript;

      const wordsISaid = whatISaid.split(' ');

      wordsISaid.forEach((wordISaid) => {
        if(voiceMappings[wordISaid]) {
          console.log(`Recognised "${wordISaid}" in "${whatISaid}"`);
          voiceMappings[wordISaid].do();
        }
      });
    };
  
    recognition.start();
  };

  return (
    <div style={{ position: 'relative', height: '100%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ position: 'absolute', height: '240px', width: '450px', backgroundColor: 'rgba(0, 0, 0, 0.1)', color: '#525252', top: '30px', left: '30px', zIndex: '9999', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', lineHeight: 2 }}>
        <ul style={{ lineHeight: '35px' }}>
          <li>
            Generate Squares with Q, W, A & S
          </li>
          <li>
            Rotate the Camera with Space, ↑, ↓, ← & →
          </li>
          <li>
            You can also say keywords like 'up', 'down', 'left', 'right' or 'spin'
          </li>
          <li>
              In case you accepted Microphone usage, please reload the page
          </li>
        </ul>
      </div>
      <div className="camera">
        <animated.div style={{ ...squaresProps, width: '30vw', height: '30vw', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', backgroundColor: '#33313B' }}>
          <div className="square">
            <animated.div style={{ ...upperLeftSquareProps, position: 'absolute', top: 0, left: 0 }}/>
          </div>
          <div className="square">
            <animated.div style={{ ...upperRightSquareProps, position: 'absolute', top: 0, right: 0 }}/>  
          </div>
          <div className="square">
            <animated.div style={{ ...bottomLeftSquareProps, position: 'absolute', bottom: 0, left: 0 }}/>  
          </div>
          <div className="square">
            <animated.div style={{ ...bottomRightSquareProps, position: 'absolute', bottom: 0, right: 0 }}/>  
          </div>
        </animated.div>
      </div>
    </div>
  );
}

export default App;
