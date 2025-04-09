import time
import os
import json
from datetime import datetime, timedelta
from playsound import playsound
from colorama import Fore, Style, init
init(autoreset=True)


# Load sound library from JSON
with open("sound_library.json", "r") as f:
    sound_library = json.load(f)

# Store reminders in a list
reminders = []

def add_reminder(reminder_time, message, interval=None, sound_file=None):
    # Auto-map sound from keywords if none was provided
    if not sound_file:
        for keyword, mapped_sound in sound_library.items():
            if keyword in message.lower():
                sound_file = mapped_sound
                print(f"🔊 Auto-mapped keyword '{keyword}' to sound '{sound_file}'")
                break

    reminders.append({
        "time": reminder_time,
        "message": message,
        "interval": interval,
        "sound": sound_file
    })

    interval_info = f" every {interval} min" if interval else ""
    sound_info = f" with sound '{sound_file}'" if sound_file else ""
    print(
        f"{Fore.GREEN}✅ Reminder set for {Fore.CYAN}{reminder_time}{Fore.GREEN}{interval_info}{Fore.MAGENTA}{sound_info}{Style.RESET_ALL} — '{message}'"
    )

def check_reminders():
    now = datetime.now().strftime("%H:%M")
    for reminder in reminders:
        if reminder["time"] == now:
            # Play custom sound if defined
            sound_file = reminder.get("sound")
            if sound_file:
                try:
                    playsound(sound_file)
                except Exception as e:
                    print(f"⚠️ Could not play sound '{sound_file}': {e}")

            # Show macOS notification
            os.system(f'''
                osascript -e 'display notification "{reminder["message"]}" with title "REMINDER TIME"'
            ''')

            print(f"\n💧 Reminder: {reminder['message']} — It's {now}!\n")

            # Kill-switch trigger
            if "kill" in reminder["message"].lower():
                print("💀 KILL REMINDER TRIGGERED — shutting down agent.")
                exit()

            # Reschedule if recurring
            if reminder["interval"]:
                next_time = (
                    datetime.strptime(reminder["time"], "%H:%M") +
                    timedelta(minutes=reminder["interval"])
                ).strftime("%H:%M")
                reminder["time"] = next_time

def list_reminders():
    if not reminders:
        print(f"{Fore.YELLOW}📭 No reminders set yet.\n")
        return

    print(f"\n{Fore.BLUE}📋 Current Reminders:")
    for r in reminders:
        interval_text = f"(every {r['interval']} min)" if r['interval'] else "(once)"
        print(f"{Fore.CYAN}• {r['time']} — {r['message']} {Fore.GREEN}{interval_text}")
    print()

print("👋 Welcome to Auditoji — Where Habits Get Their Own Soundtrack")
print("Type your reminder like this: '14:30 drink water every 90'")
print("Type 'start' to begin checking reminders.")
print("Type 'help' for the full guide.\n")

while True:
    user_input = input("📝> ")

    if user_input.lower() in ["help", "?"]:
        print("""
🆘 Auditoji Help Menu

1. Add reminders.
Supported Auditory Reminders:
    - drink water
    - breathe
    - stretch
    - dog (any reminders for your dog)
    - cat (any reminders for your cat)
    - kill Agent (reminder to shut down the agent)

2. Make them recurring.
Add a reminder like: 14:30 drink water every 90 (this means 'starting at 14:30, remind me to drink water every 90 minutes until the agent is shut down')
• To make it recurring:   Add 'every X' (minutes)

3. After adding reminders, type 'start' to turn on Auditoji.
• Type 'start', and Auditoji will do the rest.
        """)
        continue

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
            parts = parts[:sound_index]

        if "every" in parts:
            every_index = parts.index("every")
            message = " ".join(parts[1:every_index])
            interval = int(parts[every_index + 1])
        else:
            message = " ".join(parts[1:])

        datetime.strptime(r_time, "%H:%M")
        add_reminder(r_time, message, interval, sound_file)
    except:
        print("⚠️ Invalid format. Please use 'HH:MM your message [every X] [sound: filename.wav]'")

while True:
    check_reminders()
    time.sleep(60)
