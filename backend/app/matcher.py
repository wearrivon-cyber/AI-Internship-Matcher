def norm(items):

    return {
        str(item).strip().lower()
        for item in items
        if str(item).strip()
    }


def score_program(profile, program):

    required = norm(
        program.get("required_skills", [])
    )

    available = norm(
        profile.get("skills", [])
    )

    matched = sorted(
        required & available
    )

    missing = sorted(
        required - available
    )

    if required:

        skill_score = round(
            100 * len(matched) / len(required)
        )

    else:

        skill_score = 0

    tags = norm(
        program.get("tags", [])
    )

    interests = norm(
        profile.get("interests", [])
    )

    if tags:

        interest_score = round(
            100 * len(tags & interests) / len(tags)
        )

    else:

        interest_score = 0

    education_rule = str(
        program.get("eligibility", {}).get(
            "education", ""
        )
    ).lower().strip()

    education = str(
        profile.get("education", "")
    ).lower()

    education_ok = (
        not education_rule
        or education_rule in education
        or education in education_rule
    )

    score = round(
        skill_score * 0.8
        + interest_score * 0.2
    )

    return {

        "score": score,

        "matched_skills": matched,

        "missing_skills": missing,

        "education_eligible": education_ok,

        "eligible": (
            education_ok
            and program.get("active", True)
        ),

        "reasons": [

            f"{len(matched)} of {len(required)} required skills matched."

        ]

    }


def rank_programs(profile, programs):

    results = []

    for program in programs:

        match = score_program(
            profile,
            program
        )

        if match["eligible"]:

            results.append({

                **program,

                "match": match

            })

    return sorted(
        results,
        key=lambda item: item["match"]["score"],
        reverse=True
    )