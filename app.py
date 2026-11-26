from flask import Flask, render_template, request, redirect, url_for

# static_folder="public" so /style.css works both locally and on Vercel
app = Flask(__name__, static_folder="public", static_url_path="")


# Page 1: homepage + search
@app.route("/", methods=["GET", "POST"])
def home():
    error = None

    if request.method == "POST":
        keyword = request.form.get("keyword", "").strip().lower()

        if keyword in ("27.nov", "27 nov", "27/11", "27.11"):
            return redirect(url_for("birthday"))

        error = "No results found. Try again, you bozo."

    return render_template("index.html", error=error)


# Page 2: birthday message
@app.route("/birthday")
def birthday():
    return render_template("birthday.html")


# Page 3: archive (the Unc Test)
@app.route("/capsule")
def capsule():
    return render_template("capsule.html")


# Page 4: cats + shutdown
@app.route("/final")
def final():
    return render_template("final.html")


if __name__ == "__main__":
    app.run(debug=True)