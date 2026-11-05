from app.matcher import score_program


def test_skill_gap():

    program = {

        "required_skills": [
            "python",
            "sql"
        ],

        "tags": [],

        "eligibility": {},

        "active": True

    }

    result = score_program(

        {
            "skills": ["Python"],
            "interests": [],
            "education": ""
        },

        program

    )

    assert result["score"] == 40

    assert result["matched_skills"] == [
        "python"
    ]

    assert result["missing_skills"] == [
        "sql"
    ]