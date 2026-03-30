def choose_design(category, marketplace):

    if marketplace == "uzum":
        if category == "electronics":
            return "dark_neon"

        if category == "auto":
            return "tech_blue"

        if category == "fashion":
            return "luxury_black"

    return "clean_white"