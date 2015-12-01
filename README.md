FE Nanodegree Arcade Game
=========================

# Overview

This is a scaled down version of the classic Frogger game, implemented using
Javascript and HTML5 Canvas. The game starts with the Player on the bottom of
screen. His goal is to cross the stones to the water without being clobbered by
the scarabs.

# Classes

## Actor

This class represents a generic thingy on the playing field. It takes
care of the heavy lifting of positioning the sprite (image) within the animation
framework. The key movement functionality lies in the `moveTo()` method that
starts motion towards a position on the field at the given speed.

## Player

This class represents the player of the game. It is an Actor that looks for
movement commands and steps in the given direction. If the Player reaches the
top row (the water), the Player wins.

## Enemy

This class represents the enemies of the player. These are Actors (there may be
several) that move across the field at random speeds, trying to collide with the
player. If an Enemy collides with the Player, the Player loses.

# Refactoring Opportunities

**Positional Object** The implementation could be refined by abstracting the
concept of position that would more easily translate between grid position (for
placement and moves) and coordinate position (for smooth animation).

# Further Features

**Scorekeeping** Display the current score at the bottom of the field. Perhaps
allocate points based on difficulty and how many games have been won and lost.

**Difficulty Level** As the game progresses, increase the difficulty level by
adding more and faster enemies to the field.
