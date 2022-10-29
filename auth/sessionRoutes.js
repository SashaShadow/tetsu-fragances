import passport from 'passport';

export const loginRoute = () => {
    return (req, res) => {
        console.log('hi')
        if (req.user) {
            return res.redirect('/shop/')
        } else {
            res.render("pages/login.ejs", { message: req.flash('error')})
        }
    }
}

export const loginPost = () => {
    return passport.authenticate('login', {
        successRedirect: '/shop',
        failureRedirect: '/shop/login',
        failureFlash: true
      })
}

export const signupRoute = () => {
    return (req, res) => {
        if (req.user) {
            return res.redirect('/shop/')
        } else {
            res.render("pages/signup.ejs", { message: req.flash('error') })
        }
    }
}

export const signupPost = () => {
    return passport.authenticate('signup', {
        successRedirect: '/shop',
        failureRedirect: '/shop/signup',
        failureFlash: true
    })
}

export const logout = () => {
    return (req, res) => {

        const nameRemanent = req.user?.username || null; 
        if (nameRemanent) {
            return req.session.destroy(err => {
                if (!err) {
                  return res.render("pages/logout.ejs", {name: nameRemanent})
                }
                return res.render("pages/error.ejs", { error: err })
              })
        } else {
            return res.render("pages/expired.ejs")
        }  
       }
}