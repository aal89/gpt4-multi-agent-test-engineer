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
To install the GPT-4 Multi-Agent Test Engineer globally, open your terminal and run the following command:

```sh
npm install -g autotestgpt
```

This will install the tool globally, making it accessible from any location in your system.

Use it like this: `autotestgpt [path-to-file]` to generate test for code. See chapters below in order to configure it.

### Environmental Variables

Configure your project using the following environmental variables:

| Variable Name                            | Description                                                                                                 |
|------------------------------------------|-------------------------------------------------------------------------------------------------------------|
| `AUTOTESTGPT_OPENAI_API_KEY`             | Your OpenAI API key for authentication. You can also set this value through the `--api-key` cli option      |


### 📄 Configuration File

To enhance the capabilities of the GPT-4 Multi-Agent Test Engineer, the tool relies on a configuration file in YAML format. This configuration file should be placed in the root folder of your project and provides essential information for generating tests. Below is an example structure of the configuration file:

```yaml
.ts:
  techstack:
    - typescript
    - jest
  context: |-
    Write for each exported function a unit test. Wrap test groups in 'describe' blocks.
  examples:
    - name: openai file
      code: src/openai.ts
      tests: src/openai.test.ts
```

The configuration file consists of the following key sections:

- `.ts`: This section defines the target file type. In this example, `.ts` represents TypeScript files.
- `techstack`: Here, you specify the technology stack associated with your project. This helps the tool understand the context and requirements for generating appropriate tests.
- `context`: (optional) This field allows you to provide a high-level description of how tests should be generated for the specified file type. You can use this to guide the tool in creating tests that align with your project's testing standards.
- `examples`: (optional) Under this section, you can list specific examples related to your project. These examples include:
  - `name`: A descriptive name for the example.
  - `code`: The path to the code file that stands as an example in all prompts used to further enhance the test engineer.
  - `tests`: The path to the tests for the code above. This will also be included in all prompts to the test engineer.

By configuring this file according to your project's needs, you can tailor the test generation process to match your testing framework and standards.

Remember to keep the configuration file up to date as your project evolves and as new testing requirements emerge.

By utilizing this configuration file, you can ensure that the GPT-4 Multi-Agent Test Engineer generates tests that align with your project's testing goals and specifications.

## 🤖 Meet the Agents

- Agent 1 🕵️: 🚀: Senior lead (test) engineer who's role it is to review and refactor tests.
- Agent 2 🧪: A software engineer specialized in writing automated tests.

## 💬 Feedback

We love feedback! If you have any suggestions, ideas, or issues, please open an [issue](https://github.com/aal89/gpt4-multi-agent-test-engineer/issues).

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

A big thank you to the OpenAI, BabyAGI and AutoGPT teams for making GPT-4 available and inspiring this project.

Let's revolutionize the way we approach testing with the GPT-4 Multi-Agent Test Engineer! 🌟
