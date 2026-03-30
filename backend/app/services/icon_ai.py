def pick_icons(category):

    if category == "auto":

        return [
            "icons/quality.png",
            "icons/fit.png",
            "icons/durability.png",
            "icons/warranty.png"
        ]

    if category == "electronics":

        return [
            "icons/sound.png",
            "icons/battery.png",
            "icons/bluetooth.png",
            "icons/comfort.png"
        ]

    return []