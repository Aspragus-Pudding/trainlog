# Real-phone checklist (10 minutes, one iPhone and one Android)

`tests/mobile.js` plays toolbars, keyboards and safe areas, but it can't show
the real iOS toolbar animating, the real keyboard, or the system back gesture.
Before telling testers a build is ready, run this once on one iPhone (home-screen
app) and one Android phone (installed from Chrome). Use the demo
(`…/trainlog/?demo` → Demo options → Fresh install) so nothing touches your log.

## Setup (new user)
1. Fresh install. Setup fills the screen with no tab bar behind it. The header
   reads "Step 1 of 9" and the bar fills as you go.
2. On the bodyweight step, tap the field. The keyboard opens and **Next** stays
   above it. Type, then close the keyboard: nothing jumps or hides.
3. Swipe back from the left edge (iPhone) or press Back (Android) on step 3.
   You go to step 2. You don't leave the app.
4. On the goal step, open **Fine-tune** and drag the strength ↔ size slider.
   "Your blocks" changes under it.
5. Close the app from the app switcher on step 5, reopen it, and tap **Continue
   setup**. You're back on step 5 with your answers.
6. At the plan, tap **Next**. Six "How your program works" cards show your
   own blocks and days. **Skip and start** is in reach on each.

## A session
7. The Train tab, before Start: move an exercise up with its arrow, then drag
   another by its handle; long-press one to swap it; add one; take a set off
   one. **Start** (at the bottom) begins in that order.
8. A first-time card shows on the check-in. **Got it** removes it, and it
   doesn't come back on the next check-in.
9. On the set card, tap the weight and type a number with the keyboard open.
   **Log set** stays visible.
10. Log a set. The rest bar shows and doesn't cover Log set. Tap +30s, then
    **Always**, and the next set's rest starts at the new time.
11. Move another exercise above the one you're on mid-exercise. Log set stays on
    yours. Then, with nothing logged on the current one, move another into its
    place: Log set follows the moved one.
12. Open an exercise's info sheet, scroll to the bottom and back, then swipe back.
    The sheet closes and you're still in the workout.

## Settings and themes
13. Open the Settings tab. All five tab labels read in full. Enter the theme
    code GOBLIN: the colours change and a logged set says "Set 2 hoarded".
    Turn off "Use this theme's voice" and it says "Set 2 logged" again.
14. Enter #FF00AA as a code. It applies, and any adjustment is named in one line.
    **Reset to the default look** brings back the standard look.
15. Settings → About → **Diagnostics** → Copy, then paste it into a note. It
    names the phone, browser, home screen and visible size.

If any step fails, send a note from that screen. The note records where you
were.
