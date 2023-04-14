# pip install -r requirements.txt

from gpt_index import GPTSimpleVectorIndex
import sys

EMPTY_RESPONSE = 'Empty Response'

def chatbot(input_text, max_length=1000):
	index = GPTSimpleVectorIndex.load_from_disk('openai/index.json')
	response = ''
	while len(response) < max_length:
		query_text = input_text + response
		response_chunk = index.query(query_text, response_mode="compact").response
		if response_chunk == EMPTY_RESPONSE:
			break
		if not response_chunk:
			break
		response += response_chunk
	response = response.rstrip()  # remove trailing whitespace
	while response.endswith(EMPTY_RESPONSE):
		response = response[:response.rfind(EMPTY_RESPONSE)]
		response = response.rstrip()  # remove trailing whitespace
	return response

if __name__ == '__main__':
	if len(sys.argv) < 2:
		print("Please provide input text as a command line argument.")
		exit(1)
	else:
		input_text = sys.argv[1]
		response = chatbot(input_text)
		print('##START##', response, '##DONE##')
