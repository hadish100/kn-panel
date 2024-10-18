import collections
import argparse
import base64
import json
import zlib

def encode_config(config):
    json_str = json.dumps(config, indent=4).encode() 

    compressed_data = zlib.compress(json_str)

    original_data_len = len(json_str)
    header = original_data_len.to_bytes(4, byteorder='big')
    
    encoded_data = base64.urlsafe_b64encode(header + compressed_data).decode().rstrip("=")
    return f"vpn://{encoded_data}"

def decode_config(encoded_string):
    encoded_data = encoded_string.replace("vpn://", "")
    padding = 4 - (len(encoded_data) % 4)
    encoded_data += "=" * padding
    compressed_data = base64.urlsafe_b64decode(encoded_data)

    try:
        original_data_len = int.from_bytes(compressed_data[:4], byteorder='big')

        decompressed_data = zlib.decompress(compressed_data[4:])

        if len(decompressed_data) != original_data_len:
            raise ValueError("Invalid length of decompressed data")

        return json.loads(decompressed_data, object_pairs_hook=collections.OrderedDict)
    except zlib.error:
        return json.loads(compressed_data.decode(), object_pairs_hook=collections.OrderedDict)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description='''Converts AmneziaVPN configuration between Base64 string and JSON.

        Usage examples:

        1. Decode Base64 string to console:
           python amnezia-config-decoder.py vpn://AAAGX..

        2. Decode Base64 string and save to file:
           python amnezia-config-decoder.py vpn://AAAGX.. -o config.json

        3. Encode JSON from file to Base64 string:
           python amnezia-config-decoder.py -i config.json''',
        formatter_class=argparse.RawDescriptionHelpFormatter
    )
    parser.add_argument('encoded_string', metavar='vpn://...', type=str, nargs='?',
                        help='Base64 string with "vpn://" prefix containing AmneziaVPN configuration.')
    parser.add_argument('-i', '--input', metavar='input.json', type=str,
                        help='Path to JSON file to read configuration.')
    parser.add_argument('-o', '--output', metavar='output.json', type=str,
                        help='Path to JSON file to write decoded configuration. '
                             'If not specified, configuration will be printed to console.')

    args = parser.parse_args()

    if args.input and args.encoded_string:
        parser.print_help()
        print("\nError: Cannot specify both Base64 string and JSON file simultaneously.")
    elif args.input:
        with open(args.input, 'r') as f:
            config = json.load(f)
            encoded_string = encode_config(config)
            print(encoded_string)
    elif args.encoded_string:
        config = decode_config(args.encoded_string)
        if args.output:
            with open(args.output, 'w') as f:
                json.dump(config, f, indent=4)
            print(f"Configuration saved to {args.output}")
        else:
            print(json.dumps(config, indent=4))
    else:
        parser.print_help()