/** @format */

const src = process.env.URL;
export const registerConfirmation = ({
  name,
  username,
  userType,
  token,
  lang,
}) => {
  return {
    html: `
            <!DOCTYPE html>
              <html lang="${lang ? lang : "fr"}">
                <head>
                  <meta charset="UTF-8" />
                  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                  <title>Email</title>
                </head>
                <body>
                  <table
                    style="
                      position: relative;
                      background: #ebebeb;
                      width: 100%;
                      height: 100%;
                      margin: 0;
                      padding: 0;
                      scroll-behavior: smooth;
                      box-sizing: border-box;
                      color: inherit;
                      text-overflow: ellipsis;
                      text-decoration: inherit;
                      border: inherit;
                      outline: inherit;
                      font-family: 'Archivo', sans-serif;
                      padding: 0 2.5% 2.5% 2.5%;
                    "
                  >
                    <tr>
                      <td>
                        <table style="width: 100%; padding: 0 1rem 1rem 1rem;">
                          <tr>
                            <td style="width: 100%; text-align: center">
                              <img
                                style="height: 3rem; scale(2)"
                                src="${src}/logo.png"
                                alt="Yuppie HUB"
                              />
                            </td>
                          </tr>
                          <tr>
                            <table
                              style="
                                background: #fff;
                                padding: 2rem 0;
                                width: 100%;
                                border-radius: 4px;
                                height: 100%;
                                box-shadow: rgba(17, 12, 46, 0.15) 0px 48px 100px 0px;
                              "
                            >
                              <tr>
                                <td
                                  style="
                                    width: 100%;
                                    color: #036eff;
                                    font-weight: 500;
                                    font-size: 1.5rem;
                                    text-align: center;
                                    text-transform: uppercase;
                                  "
                                >
                                  Inscription
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  <table style="width: 100%; padding: 1rem 0 0 0">
                                    <tr>
                                      <td
                                        style="
                                          width: 100%;
                                          font-weight: 700;
                                          text-align: center;
                                        "
                                      >
                                        Bonjour <span> ${username} ${name} </span>
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  <table style="width: 100%; padding: 1rem 0">
                                    <tr>
                                      <td
                                        style="width: 100%; color: #888; text-align: center"
                                      >
                                        Vous êtes inscrit en tant
                                        <span
                                          >${
                                            userType === "client"
                                              ? `<span
                                            >que <span style="font-weight: 700">client</span>
                                          </span>
                                          `
                                              : `<span
                                            >qu'<span style="font-weight: 700"
                                              >assistant</span
                                            ></span
                                          >`
                                          }</span
                                        >
                                        sur l'application Yuppie HUB.
                                      </td>
                                    </tr>
                                    <tr>
                                      <td
                                        style="width: 100%; color: #888; text-align: center"
                                      >
                                        Cliquer sur ce bouton pour activer votre compte et
                                        continuer à bénéficier de nos services.
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  <table style="width: 100%; padding: 0.5rem 0 2rem 0">
                                    <tr>
                                      <td
                                        style="width: 100%; color: #888; text-align: center"
                                      >
                                        <a
                                          href="${
                                            process.env.NEXT_PUBLIC_HOST
                                          }/accueil?t=${token}"
                                          style="
                                            padding: 0.65rem 1rem;
                                            position: relative;
                                            width: 100%;
                                            color: #fff;
                                            font-weight: bold;
                                            border: none;
                                            border-radius: 0.5rem;
                                            cursor: pointer;
                                            transition: 0.1s ease-out;
                                            box-shadow: rgba(9, 30, 66, 0.25) 0px 4px 8px -2px,
                                              rgba(9, 30, 66, 0.08) 0px 0px 0px 1px;
                                            text-transform: uppercase;
                                            text-decoration: none;
                                            background: linear-gradient(
                                              135deg,
                                              #badf5b,
                                              #036eff
                                            );
                                          "
                                          target="_blank"
                                          rel="noopener noreferrer"
                                        >
                                          Activer maintenant
                                        </a>
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>

                              <tr>
                                <td
                                  style="
                                    width: 100%;
                                    color: rgba(0, 0, 0, 0.7);
                                    font-weight: bold;
                                    text-align: center;
                                  "
                                >
                                  Rendez-vous sur le site.
                                </td>
                              </tr>

                              <tr>
                                <td
                                  style="
                                    width: 100%;
                                    color: rgba(0, 0, 0, 0.7);
                                    font-weight: bold;
                                    text-align: center;
                                  "
                                >
                                  A bientôt.
                                </td>
                              </tr>
                            </table>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </body>
              </html>

  `,
  };
};
