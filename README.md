# 🤖 GPT-4 Multi-Agent Test Engineer 🤖

Welcome to the GPT-4 Multi-Agent Test Engineer project! This innovative tool leverages the power of GPT-4 to automate the creation of tests, making your testing process more efficient and intelligent. 🚀

## 📋 Project Overview

### What is it?
The GPT-4 Multi-Agent Test Engineer is a sophisticated testing assistant designed to generate test cases, scripts, and scenarios for a wide range of applications and software systems.

### Cost Awareness

It's crucial to be aware of the potential costs associated with using the OpenAI API, as costs can accumulate based on usage. While the GPT-4 Multi-Agent Test Engineer offers powerful testing capabilities, it's essential to keep an eye on your API usage to manage expenses effectively.

### Features
- 🧠 Powered by GPT-4: Harness the advanced natural language processing capabilities of GPT-4.
- 🤝 Multi-Agent Collaboration: Collaborate with multiple test agents for comprehensive testing coverage.
- 📜 Test Script Generation: Automatically generate tests for your applications.
- 🎯 Specific: By implementing a highly specialized Multi-Agent approach, we aim to keep costs significantly lower compared to requesting the same task from AutoGPT or BabyAGI.
- 🚦 Test Automation: Seamlessly integrate with test automation frameworks.
- 📦 Customizable: Tailor the test engineer to your specific testing needs.

## 🚀 Getting Started

### Prerequisites
Before you start using the GPT-4 Multi-Agent Test Engineer, ensure you have the following:
- Node.js v16 (npm)
- OpenAI API Key (Get one at [OpenAI](https://platform.openai.com/account/api-keys))

### Installation
1. Clone this repository:
   ```bash
   git clone https://github.com/aal89/gpt4-multi-agent-test-engineer.git
   cd gpt4-multi-agent-test-engineer
   ```

2. Install dependencies:
   ```bash
   npm i
   ```

3. Set up your environmental variables:

4. Start the GPT-4 Multi-Agent Test Engineer:
   ```bash
   npm run start
   ```

## 📄 Usage

1. Configure your application parameters (recommended; use the .env file).
2. Start the multi-agent test engineer. You will be prompted what to do.
3. Collaborate with the agents to create test cases.
4. Review and analyze generated tests.

### Environmental Variables

Configure your project using the following environmental variables:

| Variable Name                | Description                                           |
|------------------------------|-------------------------------------------------------|
| `OPENAI_API_KEY`             | Your OpenAI API key for authentication.               |
| `ADDITIONAL_AGENT_CONTEXT`   | Additional global context for all the agents to use.  |
| `TOKEN_CAP`                  | Maximum tokens to be used overall, used as a hard cap to not maxout your credit card.                          |
| `DEBUG`                      | Enable or disable debugging mode.   

## 🤖 Meet the Agents

- Agent 1 🕵️: Specializes in UI and front-end testing.
- Agent 2 🧪: An expert in API and backend testing.
- Agent 3 🚀: Senior lead (test) engineer who's role it is to review and refactor tests.

## 💬 Feedback

We love feedback! If you have any suggestions, ideas, or issues, please open an [issue](https://github.com/aal89/gpt4-multi-agent-test-engineer/issues).

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

A big thank you to the OpenAI, BabyAGI and AutoGPT teams for making GPT-4 available and inspiring this project.

Let's revolutionize the way we approach testing with the GPT-4 Multi-Agent Test Engineer! 🌟
