class Start extends Scene {
    create() {
        this.engine.setTitle(this.engine.storyData.Title); // TODO: replace this text using this.engine.storyData to find the story title
        this.engine.addChoice("Begin the story");
    }

    handleChoice() {
        this.engine.gotoScene(Location, this.engine.storyData.InitialLocation); // TODO: replace this text by the initial location of the story
    }
}

class Location extends Scene {
    create(key) {
        let locationData = this.engine.storyData.Locations[key]; // TODO: use `key` to get the data object for the current story location
        this.engine.show(locationData.Body); // TODO: replace this text by the Body of the location data
        if(locationData.Mechanism){
            this.displayMechanism(locationData.Mechanism)
        }
        if(locationData.Choices) { // TODO: check if the location has any Choices
            for(let choice of locationData.Choices) { // TODO: loop over the location's Choices
                this.engine.addChoice(choice.Text, choice); // TODO: use the Text of the choice
                // TODO: add a useful second argument to addChoice so that the current code of handleChoice below works
            }
        } else {
            this.engine.addChoice("The end.")
        }
    }

    handleChoice(choice) {
        if (choice) {
            if(choice.Action == "PlayMessage"){
                this.playRandomMessage();
                this.engine.show("&gt; " + choice.Text);
                this.engine.gotoScene(Location, choice.Target);
            }
            else if (choice.RequiresKey) {
                if (this.engine.playerHasKey) {
                    this.engine.show("You stick in the key. The door opens with a click.")
                    this.engine.show("&gt; " + choice.Text);
                    this.engine.gotoScene(Location, choice.Target);
                } else {
                    this.engine.show("You need a key to unlock this.");
                    this.engine.show("&gt; " + choice.Text);
                    this.engine.gotoScene(Location, "Garden");
                }
            } else if(choice.Action == "GetKey"){
                this.engine.obtainKey();
                this.engine.show("You found a key in the cookie box, I wonder what this opens.")
                this.engine.show("&gt; " + choice.Text);
                this.engine.gotoScene(Location, choice.Target);
            }
            else {
                this.engine.show("&gt; "+choice.Text);
                this.engine.gotoScene(Location, choice.Target);
            }
        } else {
            this.engine.gotoScene(End);
        }
    }
    
    playRandomMessage() {
        let messages = this.engine.storyData.Locations["Attic"].Mechanism.Messages;
        let randomMessage = messages[Math.floor(Math.random() * messages.length)];
        this.engine.show("You hear a message from the recorder:");
        this.engine.show(randomMessage);
    }

    displayMechanism(mechanism) {
        this.engine.show("The radio is " + mechanism.State + " now.");
    }
}

class End extends Scene {
    create() {
        this.engine.show("<hr>");
        this.engine.show(this.engine.storyData.Credits);
    }
}

Engine.load(Start, 'myStory.json');