import time
from datetime import datetime, timedelta
from playsound import playsound
import json
# Load the sound library from JSON
with open("sound_library.json", "r") as f:
    sound_library = json.load(f)

import os

def show_notification(title, message):
    os.system(f'''
              osascript -e 'display notification "{message}" with title "{title}"'
              ''')



# Store reminders in a list of dicts
reminders = []

def add_reminder(reminder_time, message, interval=None, sound_file=None):
    # 🔁 Auto-map sound if not manually provided
    if not sound_file:
        for keyword, mapped_sound in sound_library.items():
            if keyword in message.lower():
                sound_file = mapped_sound
                print(f"🔊 Auto-mapped keyword '{keyword}' to sound '{mapped_sound}'")
                break

    # 📦 Add reminder to list
    reminders.append({
        "time": reminder_time,
        "message": message,
        "interval": interval,
        "sound": sound_file
    })

    # ✅ Print confirmation
    interval_info = f" every {interval} min" if interval else ""
    sound_info = f" with sound '{sound_file}'" if sound_file else ""
    print(f"✅ Reminder set for {reminder_time}{interval_info}{sound_info} — '{message}'")


def check_reminders():
    now = datetime.now().strftime("%H:%M")
    for reminder in reminders:
        if reminder["time"] == now:
            # 🔊 Play custom sound if defined
            sound_file = reminder.get("sound")
            if sound_file:
                try:
                    playsound(sound_file)
                except Exception as e:
                    print(f"⚠️ Could not play sound '{sound_file}': {e}")

            # 💧 Print the reminder
            print(f"\n💧 Reminder: {reminder['message']} — It's {now}!\n")
            show_notification ("REMINDER TIME", reminder["message"])

            # 💀 Kill switch
            if "kill" in reminder["message"].lower():
                print("💀 KILL REMINDER TRIGGERED — shutting down agent.")
                exit()

            # 🔁 If repeating, update time
            if reminder["interval"]:
                next_time = (
                    datetime.strptime(reminder["time"], "%H:%M") +
                    timedelta(minutes=reminder["interval"])
                ).strftime("%H:%M")
                reminder["time"] = next_time


print("👋 Welcome to Auditoji: A Marriage of Tasks & Sounds")
print("Type your reminder like this: '14:30 drink water every 90'")
print("Leave off 'every X' if you only want it once.")
print("Write your reminders for the day, then type 'start' to begin checking reminders.\n")

while True:
    user_input = input("📝> ")

    if user_input.lower() == "start":
        print("\n⏱️ Auditoji is now watching the clock...\n")
        break

    try:
        parts = user_input.strip().split()
        r_time = parts[0]

        sound_file = None
        interval = None

        if "sound:" in parts:
            sound_index = parts.index("sound:")
            sound_file = parts[sound_index + 1]
            parts = parts[:sound_index]  # chop off the sound part for message parsing

        if "every" in parts:
            every_index = parts.index("every")
            message = " ".join(parts[1:every_index])
            interval = int(parts[every_index + 1])
        else:
            message = " ".join(parts[1:])

        # Validate time format
        datetime.strptime(r_time, "%H:%M")
        add_reminder(r_time, message, interval, sound_file)
    except:
        print("⚠️ Invalid format. Use: 'HH:MM message [every X] [sound: filename.wav]'")

# Main loop
while True:
    check_reminders()
    time.sleep(60)
