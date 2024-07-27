(async function () {
    const addAudioDelay = async () => {
      try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const delaySeconds = 5  ; // 5-second delay
  
        // Get user media (microphone input)
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const source = audioContext.createMediaStreamSource(stream);
  
        // Create an AudioBuffer to store audio data
        const bufferSize = audioContext.sampleRate * delaySeconds;
        const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
        const bufferData = buffer.getChannelData(0);
  
        // Create a buffer source node
        const bufferSource = audioContext.createBufferSource();
        bufferSource.buffer = buffer;
  
        // Connect the source to the buffer
        source.connect(bufferSource);
  
        // Create a script processor to process the audio data
        const scriptProcessor = audioContext.createScriptProcessor(4096, 1, 1);
        scriptProcessor.onaudioprocess = (event) => {
          const inputData = event.inputBuffer.getChannelData(0);
          const outputData = event.outputBuffer.getChannelData(0);
          // Implement buffering to apply delay
          for (let i = 0; i < inputData.length; i++) {
            const index = i + audioContext.sampleRate * delaySeconds;
            outputData[i] = bufferData[index % bufferData.length];
            bufferData[i % bufferData.length] = inputData[i];
          }
        };
  
        // Connect nodes: source -> script processor -> destination
        source.connect(scriptProcessor);
        scriptProcessor.connect(audioContext.destination);
  
        console.log("Audio is now delayed by 5 seconds.");
        alert("Audio delay of 5 seconds has been enabled.");
      } catch (error) {
        console.error("Error capturing or processing audio:", error);
      }
    };
  
    const createPopup = () => {
      if (document.getElementById('audio-delay-popup')) {
        return;
      }
  
      const popup = document.createElement('div');
      popup.id = 'audio-delay-popup';
      popup.style.position = 'fixed';
      popup.style.top = '10%';
      popup.style.left = '50%';
      popup.style.transform = 'translateX(-50%)';
      popup.style.backgroundColor = '#fff';
      popup.style.padding = '20px';
      popup.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
      popup.style.zIndex = 1000;
      popup.style.borderRadius = '8px';
      popup.style.fontFamily = 'Arial, sans-serif';
  
      popup.innerHTML = `
        <h3>Enable Audio Delay</h3>
        <p>Would you like to enable a 5-second delay for your outgoing audio?</p>
        <button id="enable-delay" style="margin-right: 10px; background-color: #007bff; color: white; border: none; padding: 10px; border-radius: 5px; cursor: pointer;">Yes</button>
        <button id="disable-delay" style="background-color: #f44336; color: white; border: none; padding: 10px; border-radius: 5px; cursor: pointer;">No</button>
      `;
  
      document.body.appendChild(popup);
  
      document.getElementById('enable-delay').addEventListener('click', () => {
        addAudioDelay().then(() => {
          document.body.removeChild(popup);
        });
      });
  
      document.getElementById('disable-delay').addEventListener('click', () => {
        document.body.removeChild(popup);
      });
    };
  
    createPopup();
  })();
  