# Arcade score initials

A simplistic js ES6 implementation of old school arcade game leader board inputs.  
<br>
The module was originally developed for big Android screens where the native
keyboard could not be used. This was an easy solution to let the player enter 
her initials easily in the leaderboard, 
without having to develop or require a full-blown on-screen keyboard in javascript.  
<br>
**Currently only for touch devices.** The input can be changed with a single tap, 
a long tap to cycle through the alphabet or by holding and moving up or down.  

## [Demo](https://pecuchet.github.io/arcade-score-initials/)
![screenshot](https://raw.githubusercontent.com/pecuchet/arcade-score-initials/gh-pages/screenshot.jpg)

## Usage
There is a small factory class to create the desired number of inputs at once:
```
(new ArcadeInitials())
    .create(3, containerElement)
    .setActive(0)
    .bindSubmit(button, () => console.log(this.getInput()));
```

Alternatively input can be created one by one:  
```
new InitialInput({
    parent: containerElement,
    active: true,
    onActiveChange: () => console.log(this.getValue())
})
```
