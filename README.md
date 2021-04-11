# Tabbyhack -- alpha release

**Demo is running at https://jzohrab.github.io/tabbyhack/**

A work-in-progress tool to generate guitar TAB from audio input.  This could be useful for teachers and guitar hackers to get quick TAB snippets.

Visit its site and click start, allow mic access, and start playing -- slowly, and only a single note at a time (no chords).  It will generate some candidate TAB, after which you can select the notes you really want, and export ascii TAB.

## Demos

### Quick gif demo:

Sample output, generated by going to https://jzohrab.github.io/tabbyhack/, clicking 'Start', and playing some notes on the guitar:

![README demo](https://media.giphy.com/media/rNQAo7NcQ6nTZieZlD/giphy.gif)

Explanation:

* I start the app, and play some notes on the guitar.  Tabbyhack fills in candidate tab entries for the strings (e.g., the third note, E-flat, can be played on the 11th fret low E, 6th fret A, and 1st fret D string).
* I stop the app, and use the cursor keys to select the notes that I actually want to use.  As the cursor moves, it leaves a "trail" of green squares that indicate the notes I've selected.
* When I'm done, I click "Write tab", and the tab gets written.  I can verify and edit it using the keyboard again.
* "Copy" copies the ascii tab to the clipboard.

Not shown in the demo:

* Making chords (possible, but you have to play each note separately, and then indicate them when navigating with the keyboard)
* Toggling the cursor to active/inactive state (useful for moving around the tab without changing anything)

Devs can also run the site locally, see "Development" below.

### YouTube

See the not-super-slick video at https://youtu.be/K6aIzLHKdnU .

## Future work (?)

This is a basic tool -- it's not a fully functional tab solution -- but it's still pretty useful.  It will never be a full tabber, that's not the intent.  Possible improvements:

* edit the tab, removing bad notes etc
* low priority: output raw data in some other form so it can be imported into other software (?)
* low priority for me, but maybe fun: styling & make it pretty
* allow for different guitar tunings, tab for out-of-tune guitars, etc
* this could be easily generalized to all fretted instruments (provided the mic can differentiate the sound)

# Development

## Overview

This project uses:

- Parcel for bundling the Javascript
- Tape for unit tests
- Aubiojs for js audio processing

## Requirements

node - v14.16.0
npm - 6.14.11

I haven't tried other versions, but the above worked for me on my Mac.

## Getting started

```
git clone <this repo>
cd <repo path>
npm install

# Build and start the local Parcel server
npm start

# Then go to the local address it tells you
```

## Running tests

`npm run test`

## Misc dev notes

* The vexflow library is included in deployment (in `npm run copyassets`).  I'm using the `div.dev.js` release file, because Parcel didn't seem to like the minified `div.prod.js` (raised errors during build).

## Contributing

Contributions would be super if it makes this more useful and interesting.

Fork; clone; make you changes and be sure to run `npm run test`; PR back to main.

# Deployment

## To github pages

After running tests, and checking the local site with `npm start`, we can deploy this automatically to a github pages repo by having everything deployed to `docs`.  See ref https://www.sitepoint.com/parcel-hyperapp-github-pages/

`npm run deploy` builds, commits, and pushes.  GH pages take a few moments to update.

# Licensing

TODO - should be free and open.  Have to set the licensing correctly to account for the open-source elements that are included (aubio)
