import sys
import json
import struct

def get_message():
    raw_length = sys.stdin.read(4)
    if not raw_length:
        sys.exit(0)
    message_length = struct.unpack('@I', raw_length.encode('utf-8'))[0]
    message = sys.stdin.read(message_length)
    return json.loads(message)

def send_message(message):
    encoded_message = json.dumps(message).encode('utf-8')
    sys.stdout.write(struct.pack('@I', len(encoded_message)))
    sys.stdout.write(encoded_message)
    sys.stdout.flush()

while True:
    message = get_message()
    if message['type'] == 'fetchMeaning':
        word = message['word']
        meaning = f"The meaning of {word} is ..."
        send_message({"type": "meaningResult", "word": word, "meaning": meaning})
