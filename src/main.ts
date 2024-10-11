import { getInput, setFailed, setOutput } from "@actions/core";
import { context } from "@actions/github";

import { isPullRequest, pullRequestDetails } from "./PullRequests.js";

export async function run() {
  try {
    console.log("before get_input")
    const token = getInput("repo_token", { required: true });
    console.log("after get_input")

    if (!isPullRequest(token)) {
      // This is a comment coming from an issue, resolve to the ref/sha of this job,
      // which is the default branch.
      setOutput("base_ref", context.ref);
      setOutput("base_sha", context.sha);
      setOutput("head_ref", context.ref);
      setOutput("head_sha", context.sha);
    } else {
      const {
        base_ref,
        base_sha,
        head_ref,
        head_sha,
      } = await pullRequestDetails(token);

      setOutput("base_ref", base_ref);
      setOutput("base_sha", base_sha);
      setOutput("head_ref", head_ref);
      setOutput("head_sha", head_sha);
    }
  } catch (error) {
    if (error instanceof Error) {
      setFailed(error.message);
    } else {
      throw error;
    }
  }
}

run();
