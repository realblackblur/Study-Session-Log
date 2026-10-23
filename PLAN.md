## 1. Goal

- This app is mainly for students for tracking study sessions time with subject.

## 2. List what the user can do

- **Start / Pause**: I can start by tapping btn for the first time and pause by tapping btn for the second time.
- **Reset**: I can use this btn to reset it to 00:00:00 (Default)
- **Save**: I can use this to save my session

## 3. Image is attached

## 4. Feature as a story

1. **Timer**

- What I see before: The timer displays 00:00:00 when no study time has been recorded in the current session.
- What I do: I start the timer and let it run while I study.
- What I see after: The timer displays the elapsed study time in HH:MM:SS format and continues increasing until I stop or reset it.

2. **Start / Pause**

- What I see before: The timer is not running, and the Start button is visible.
- What I do: I click Start to begin studying, then click Pause when I finish or take a break.
- What I see after: The timer stops increasing and displays the total elapsed time for the current session.

3. **Reset**

- What I see before: The timer displays the elapsed time from my current study session.
- What I do: I click Reset to clear the current timer.
- What I see after: The timer returns to 00:00:00, ready for a new session. Previously saved sessions remain unchanged.

4. **Save**

- What I see before: The timer is stopped if running it will stopped, displaying the elapsed time of my completed study session, and a input field is available.
- What I do: I enter a subject name, such as React, and click Save.
- What I see after: A new session containing the subject name and recorded study time appears in the Session List. It shows error when the user clicks Save without entering a subject name and show error when the elapsed time is zero.

5. **Session List**

- What I see before: The Session List displays previously saved study sessions, or an empty-state message if no sessions have been saved.
- What I do: I save a new study session.
- What I see after: The new session appears in the list alongside previously saved sessions, with its subject name and recorded study time.
  1. **_Input Text_**
  - What I see before: The subject-name input field is empty or contains text from my previous entry.
  - What I do: I type the name of the subject I studied, such as JavaScript.
  - What I see after: The input field displays the entered subject name, ready to be associated with the study session when I click Save.
  2. **_Saved Time_**
  - What I see before: Each saved session displays the study time recorded when that session was saved.
  - What I do: I save a new study session after stopping the timer.
  - What I see after: The new session displays the exact duration recorded at the time of saving, formatted as HH:MM:SS. Its saved time does not change when the current timer runs or resets.

## 5. The data

- ### What save session will look like
  - `{id: number, subject: string, durationSeconds: number}`

- ### Default State
  - **elapsedSeconds**: number (0)
  - **isRunning**: boolean (false)
  - **subjectName**: string ("")
  - **sessions**: arr of objects ([])
  - **errorMessage**: string ("" — empty by default; displays an error message only when validation fails).

- ### Derived Data
  - **formattedTime**: string (Calculated from elapsedSeconds and displayed in HH:MM:SS format)
  - **formattedSavedDuration**: Each session's durationSeconds is converted to HH:MM:SS when displayed in the Session List.

## 6. Actions

- **Start**
  - Data before: isRunning = false
  - Data after: isRunning = true. The timer starts increasing elapsedSeconds.

- **Pause**
  - Data before: isRunning = true
  - Data after: isRunning = false. The current elapsedSeconds value remains unchanged.

- **Reset**
  - Data before: elapsedSeconds contains the current duration, and isRunning may be true or false.
  - Data after: elapsedSeconds = 0 and isRunning = false. Previously saved sessions remain unchanged.

- **Save**
  - Data before: subjectName contains the subject name, elapsedSeconds contains the current duration, and sessions contains previously saved sessions.

  - Data after (successful): A new session object containing id, subject, and durationSeconds is added to sessions. subjectName = "", elapsedSeconds = 0, isRunning = false, and errorMessage = "".

  - Data after (unsuccessful): If subjectName is empty or elapsedSeconds = 0, no session is added, and errorMessage displays an appropriate validation message. The timer is stopped if it was running.

## 7. Draw the boxes (components)

- **Study Tracker**: It is the parent component and the shared state lives here.

## 8: Implementation of Slices

Slice 1: Timer

- Show the timer as `00:00:00`.

Slice 2: Start / Pause

- Make Start run the timer
- Make Pause stop the timer without resetting it.

Slice 3: Reset

- Make Reset return the timer to zero.

Slice 4: Subject Input

- Let the user enter a subject name.

Slice 5: Save Sessions

- Make Save store the subject and study time.
- Show a simple list of saved sessions.
- After a successful save, clear the subject input, stop the timer, and reset elapsedSeconds to 0.

Slice 6: Validation

- Show an error if the subject is empty or the timer is zero.

Slice 7: Improve the List

- Show each session's subject and duration in HH:MM:SS.
- Show a message when the list is empty.

Slice 8: Organize and Test

- Create a Timer component for the timer display.
- Create a TimerControls component for Start, Pause, and Reset.
- Create a SessionForm component for the subject input, Save button, and error message.
- Create a SessionList component to display saved sessions.
- Start -> Pause, Start -> Pause -> Start, Start -> Reset, Start -> Reset -> Start
- Save a valid session, click Save twice, Save with an empty subject and expect an error, save with the timer at zero and expect an error, confirm Reset does not delete saved sessions, make sure failed Save stops the timer, Save while the timer is running and confirm the timer stops.
